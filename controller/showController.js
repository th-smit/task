const Show = require("../models/showModel");
const Ticket = require("../models/ticketModel");
const { successResponse, errorResponse } = require("../utils/Response");
const {
  addShowValidation,
  updateShowValidation,
} = require("../middleware/validationMiddleware");

const getShow = async (req, res) => {
  try {
    if (req.query.date) {
      const st = new Date(req.query.date);
      st.setHours(0);
      st.setMinutes(0);
      st.setSeconds(0);
      st.setMilliseconds(0);

      const ed = new Date(req.query.date);
      ed.setHours(24, 0, 0);

      const ct = new Date();

      const sortedData = await Show.find({
        title: req.query.title,
        datetime: { $gt: st, $gte: ct, $lt: ed },
      });
      await Show.deleteMany({
        title: req.query.title,
        datetime: { $lte: ct },
      });
      successResponse(sortedData, res);
    } else {
      const sortedData = await Show.find({
        title: req.query.title,
        datetime: { $gt: new Date() },
      }).sort({
        datetime: 1,
      });
      successResponse(sortedData, res);
    }
  } catch (error) {
    errorResponse(error, res, 404);
  }
};

const getShowSeat = async (req, res) => {
  try {
    const showData = await Show.find({ _id: req.params.id });
    successResponse(showData, res);
  } catch (error) {
    errorResponse(error, res, 404);
  }
};

const getMovieId = async (req, res) => {
  try {
    const movieId = Show.find({ _id: req.params.id });
    successResponse("get the movie id", res);
  } catch (error) {
    errorResponse(error, res, 501);
  }
};
const addShow = async (req, res) => {
  let showendtime = new Date(req.body.datetime);
  const ct = new Date();
  showendtime.setHours(showendtime.getHours() + req.body.hour);
  showendtime.setMinutes(showendtime.getMinutes() + req.body.minute);
  if (ct > new Date(req.body.datetime)) {
    errorResponse("invalid", res, 404);
  } else {
    try {
      const existData = await Show.find({
        $and: [
          { endtime: { $gt: req.body.datetime } },
          { datetime: { $lt: showendtime } },
          { title: req.body.title },
        ],
      });

      if (existData.length !== 0) {
        errorResponse({ err: "already show exist on selected date" }, res, 501);
      } else {
        const value = await addShowValidation.validateAsync(req.body);

        if (value) {
          const sethm = new Date(req.body.datetime);
          sethm.setSeconds(0);
          sethm.setMilliseconds(0);
          showendtime.setSeconds(0);
          showendtime.setMilliseconds(0);
          const dataObj = new Show({
            title: req.body.title,
            datetime: sethm,
            endtime: showendtime,
          });
          const showData = await dataObj.save();
          successResponse(showData, res);
        }
      }
    } catch (err) {
      errorResponse(err, res, 501);
    }
  }
};

const updateShow = async (req, res) => {
  try {
    const moviesData = await Show.findOne({ _id: req.params.id });
    if (!moviesData) {
      errorResponse("id does not exist", res, 404);
    } else {
      const updatedShowData = moviesData;

      if (req.body.title) {
        updatedShowData.title = req.body.title;
      }
      if (req.body.datetime) {
        updatedShowData.datetime = req.body.datetime;
      }

      const value = await updateShowValidation.validateAsync(req.body);
      if (value) {
        await Show.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: updatedShowData,
          },
          { New: true }
        );
        successResponse(updatedShowData, res);
      }
    }
  } catch (err) {
    errorResponse(err, res, 500);
  }
};

const deleteShow = async (req, res) => {
  try {
    const check = await Show.findById(req.params.id);
    if (check.seat.length > 10) {
      errorResponse("show can't be deleted", res, 501);
    } else {
      await Show.deleteOne({ _id: req.params.id });
      await Ticket.deleteMany({
        show_id: req.params.id,
      });
      successResponse("deleted successfully", res);
    }
  } catch (err) {
    errorResponse(err, res, 500);
  }
};

module.exports = {
  getShow,
  getShowSeat,
  getMovieId,
  addShow,
  updateShow,
  deleteShow,
};
