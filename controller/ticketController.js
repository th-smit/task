const Show = require("../models/showModel");
const Ticket = require("../models/ticketModel");
const UserPromo = require("../models/userPromoModel");
const Promocode = require("../models/promocodeModel");
const { successResponse, errorResponse } = require("../utils/Response");
const {
  addShowValidation,
  updateMovieValidation,
} = require("../middleware/validationMiddleware");

const getTicket = async (req, res) => {
  try {
    console.log(req.query.email);
    const sortedData = await Ticket.find({ email: req.query.email }).sort({
      show_datetime: 1,
    });
    console.log(sortedData);
    successResponse(sortedData, res);
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
        console.log("olddata " + oldData);
        errorResponse("selected seat already booked", res, 501);
      } else {
        successResponse(selectedSeatData, res);
      }
    }
    // else{
    //   errorResponse("can't fetch the movie data", res, 501);
    // }
  } catch (error) {
    errorResponse(error, res, 501);
  }
};

const addTicket = async (req, res) => {
  console.log("from the addTicket showid is " + req.body.showid);
  try {
    const movieShowData = await Show.find({
      title: req.body.movieTitle,
      datetime: req.body.date,
    });

    let promoData = await Promocode.find({ promo_name: req.body.promoname });
    let userPromoData = await UserPromo.find({
      email: req.body.email,
      promo_name: req.body.promoname,
    });
    console.log("userpromocode data " + userPromoData);
    console.log("promocode data " + promoData);
    //console.log("userpromocode data limit" + userPromoData[0].limit);
    //console.log("promocode data limit" + promoData[0].limit);
    if (userPromoData.length !== 0) {
      if (promoData[0].limit > userPromoData[0].limit) {
        //console.log("before update " + userPromoData.limit);
        let update = userPromoData[0];
        update.limit += 1;
        console.log("after update " + update.limit);
        await UserPromo.findOneAndUpdate(
          { email: req.body.email, promo_name: req.body.promoname },
          { $set: update },
          { New: true }
        );
        console.log("update successfully");
        if (movieShowData) {
          let oldData = movieShowData[0].seat;
          let selectedSeatData = req.body.seat;

          if (!oldData.some((oldseat) => selectedSeatData.includes(oldseat))) {
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
            });
            const userTicketData = await userTicket.save();

            successResponse(userTicketData.seat, res);
          } else {
            errorResponse("selected seat already booked", res, 501);
          }
        }
      } else {
        errorResponse("limit has reached ", res, 404);
      }
    } else {
      console.log("second part run ");
      // const data = new UserPromo({
      //   email: req.body.email,

      //   promo_id: req.body.promoid,
      // });
      // await data.save();
      // console.log("successfully created");

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
          });
          const userTicketData = await userTicket.save();

          successResponse(userTicket, res);
        } else {
          errorResponse("selected seat already booked", res, 501);
        }
      }
    }

    // if (movieShowData) {

    //   let oldData = movieShowData[0].seat;
    //   let selectedSeatData = req.body.seat;

    //   if (!oldData.some((oldseat) => selectedSeatData.includes(oldseat))) {
    //     movieShowData[0].seat = [...movieShowData[0].seat, ...req.body.seat];
    //     movieShowData[0].save();

    //     const userTicket = new Ticket({
    //       user_name: req.body.username,
    //       movie_title: req.body.movieTitle,
    //       seat: req.body.seat,
    //       show_datetime: req.body.date,
    //       price: req.body.price,
    //       email: req.body.email,
    //       show_id: req.body.showid,
    //     });
    //     const userTicketData = await userTicket.save();

    //     successResponse(userTicketData.seat, res);
    //   } else {
    //     errorResponse("selected seat already booked", res, 501);
    //   }
    // }
  } catch (error) {
    console.log(error);
    errorResponse(error, res, 501);
  }
};

const deleteTicket = async (req, res) => {
  console.log("ticket id " + req.query.ticketid);
  console.log("show id " + req.query.showid);

  try {
    const resultedData = await Ticket.findById(req.query.ticketid);
    const st = await Show.findById(req.query.showid);

    const currentDate = new Date();
    resultedData.show_datetime.setHours(
      resultedData.show_datetime.getHours() - 3
    );
    if (currentDate < resultedData.show_datetime) {
      console.log("valid cancel ticket");
      await Ticket.deleteOne({ _id: req.query.ticketid });
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
  getTicket,
  checkTicket,
  deleteTicket,
};
