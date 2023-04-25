const cron = require("node-cron");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Show = require("../models/showModel");
const Ticket = require("../models/ticketModel");
const UserPromo = require("../models/userPromoModel");
const Promocode = require("../models/promocodeModel");

const myFunction = async () => {
  let currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() - 1);
  const ticketData = await Ticket.find({
    $and: [{ pending_status: true }, { createdAt: { $lt: currentDate } }],
  });
  console.log("fetched ticket data is ", ticketData);
  ticketData.map(async (data) => {
    const updatedData = await Show.findOneAndUpdate(
      { _id: data.show_id },
      { $pull: { seat: { $in: data.seat } } },
      { New: true }
    );
  });
  const deleteTicketData = await Ticket.deleteMany({
    $and: [{ pending_status: true }, { createdAt: { $lt: currentDate } }],
  });
};

cron.schedule("*/2 * * * *", myFunction);

const { successResponse, errorResponse } = require("../utils/Response");

const getTickets = async (req, res) => {
  try {
    if (req.query.ticket_id) {
      const ticketData = await Ticket.find({ _id: req.query.ticket_id });
      successResponse(ticketData, res);
    } else {
      const sortedData = await Ticket.find({ email: req.query.email }).sort({
        show_datetime: 1,
      });
      successResponse(sortedData, res);
    }
  } catch (err) {
    errorResponse(err, res, 404);
  }
};

const checkTicket = async (req, res) => {
  try {
    const movieShowData = await Show.find({
      title: req.body.movieTitle,
      datetime: req.body.date,
    });
    if (movieShowData) {
      let oldData = movieShowData[0].seat;
      let selectedSeatData = req.body.seat;

      if (oldData.some((oldseat) => selectedSeatData.includes(oldseat))) {
        errorResponse("selected seat already booked", res, 501);
      } else {
        successResponse(selectedSeatData, res);
      }
    }
  } catch (error) {
    errorResponse(error, res, 501);
  }
};

const addTicket = async (req, res) => {
  try {
    if (req.body.promoname === undefined) {
      const movieShowData = await Show.find({
        title: req.body.movieTitle,
        datetime: req.body.date,
      });
      if (movieShowData) {
        let oldData = movieShowData[0].seat;
        let selectedSeatData = req.body.seat;

        if (!oldData.some((oldseat) => selectedSeatData.includes(oldseat))) {
          movieShowData[0].seat = [...movieShowData[0].seat, ...req.body.seat];
          movieShowData[0].save();

          const userTicket = new Ticket({
            user_name: req.body.username,
            movie_title: req.body.movieTitle,
            seat: req.body.seat,
            show_datetime: req.body.date,
            price: req.body.price,
            email: req.body.email,
            show_id: req.body.showid,
            discount: req.body.promoDiscount,
            promo_name: req.body.promoname,
            poster_api: req.body.poster_api,
          });
          const userTicketData = await userTicket.save();
          successResponse(userTicketData, res);
        } else {
          errorResponse("selected seat already booked 2", res, 501);
        }
      } else {
        errorResponse("show not available ", res, 501);
      }
    } else {
      console.log("else part run ");
      let promoData = await Promocode.find({
        promo_name: req.body.promoname,
        expiry_date: { $gt: new Date() },
      });
      if (promoData.length !== 0) {
        const movieShowData = await Show.find({
          title: req.body.movieTitle,
          datetime: req.body.date,
        });
        if (
          req.body.promoDiscount === promoData[0].discount &&
          req.body.promoname === promoData[0].promo_name &&
          new Date(req.body.expiry_date).valueOf() ===
            new Date(promoData[0].expiry_date).valueOf() &&
          req.body.limit === promoData[0].limit &&
          req.body.active_status === promoData[0].active_status &&
          promoData[0].movies.includes(req.body.movieTitle)
        ) {
          let userPromoData = await UserPromo.find({
            email: req.body.email,
            promo_name: req.body.promoname,
          });
          if (userPromoData.length !== 0) {
            if (promoData[0].limit > userPromoData[0].limit) {
              let update = userPromoData[0];
              update.limit += 1;
              update.saving += req.body.saving;
              await UserPromo.findOneAndUpdate(
                { email: req.body.email, promo_name: req.body.promoname },
                { $set: update },
                { New: true }
              );
            } else {
              errorResponse("limit has reached ", res, 404);
            }
          } else {
            const data = new UserPromo({
              email: req.body.email,
              promo_name: req.body.promoname,
              promo_id: req.body.promoid,
              movie_title: req.body.movieTitle,
              saving: req.body.saving,
            });
            await data.save();
          }
          if (movieShowData) {
            let oldData = movieShowData[0].seat;
            let selectedSeatData = req.body.seat;
            if (
              !oldData.some((oldseat) => selectedSeatData.includes(oldseat))
            ) {
              movieShowData[0].seat = [
                ...movieShowData[0].seat,
                ...req.body.seat,
              ];
              movieShowData[0].save();
              const userTicket = new Ticket({
                user_name: req.body.username,
                movie_title: req.body.movieTitle,
                seat: req.body.seat,
                show_datetime: req.body.date,
                price: req.body.price,
                email: req.body.email,
                show_id: req.body.showid,
                discount: req.body.promoDiscount,
                promo_name: req.body.promoname,
                poster_api: req.body.poster_api,
              });
              const userTicketData = await userTicket.save();
              successResponse(userTicketData, res);
            } else {
              errorResponse("selected seat already booked", res, 501);
            }
          } else {
            errorResponse("show not available ", res, 501);
          }
        } else {
          errorResponse("something went wrong", res, 501);
        }
      } else {
        errorResponse("promocode is not available", res, 501);
      }
    }
  } catch (error) {
    console.log(error);
    errorResponse(error, res, 501);
  }
};

const changePandingStatus = async (req, res) => {
  try {
    const ticketData = await Ticket.findById(req.body.ticketid);
    ticketData.pending_status = false;
    ticketData.save();
    successResponse(ticketData, res);
  } catch (error) {
    errorResponse(error, res, 501);
  }
};

const checkPendingStauts = async (req, res) => {
  const pendingStatus = await Ticket.findById(req.body.ticketid);
  if (pendingStatus) {
    successResponse("payment alredy done", res);
  } else {
    successResponse("payment not done", res);
  }
};

const deleteTicket = async (req, res) => {
  try {
    const resultedData = await Ticket.findById(req.query.ticketid);
    const st = await Show.findById(req.query.showid);
    // const currentDate = new Date();
    // resultedData.show_datetime.setHours(
    //   resultedData.show_datetime.getHours() - 3
    // );
    if (new Date() < resultedData.show_datetime) {
      if (!resultedData.pending_status) {
        await stripe.refunds.create({
          payment_intent: resultedData.payment_intentkey,
        });
      }
      const TicketData = await Ticket.deleteOne({ _id: req.query.ticketid });
      console.log("b2");
      // eslint-disable-next-line array-callback-return
      resultedData.seat.map((value1) => {
        st.seat = st.seat.filter((value2) => value1 !== value2);
      });
      await st.save();
      successResponse(st, res);
    } else {
      errorResponse("can't delete your ticket", res, 500);
    }
  } catch (error) {
    errorResponse(error, res, 500);
  }
};

module.exports = {
  addTicket,
  getTickets,
  checkTicket,
  deleteTicket,
  changePandingStatus,
  checkPendingStauts,
};
