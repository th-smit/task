const Show = require("../models/showModel");

const { successResponse, errorResponse } = require("../utils/Response");
const {
  addShowValidation,
  updateMovieValidation,
} = require("../middleware/validationMiddleware");

// const getShow = async (req, res) => {
//   try {
//     console.log(req.query.title);
//     const sortedData = await Show.find({ title: req.query.title });
//     console.log(sortedData);
//     successResponse(sortedData, res);
//   } catch (err) {
//     errorResponse(err, res, 404);
//   }
// };

const updateTicket = async (req, res) => {
  console.log("from the update Ticket seat " + req.body.seat);
  console.log("from the update Ticket movie title " + req.body.movieTitle);
  console.log("from the update Ticket time " + req.body.time);

  try {
    const movieShowData = await Show.find({ title: req.body.movieTitle });
    if (movieShowData) {
      console.log(movieShowData[0].seat);
      console.log(req.body.seat);
      console.log(typeof req.body.seat);

      let oldData = movieShowData[0].seat;
      let selectedSeatData = req.body.seat;

      if (!oldData.some((oldseat) => selectedSeatData.includes(oldseat))) {
        movieShowData[0].seat = [...movieShowData[0].seat, ...req.body.seat];
        //movieShowData[0].seat.push(req.body.seat);
        movieShowData[0].save();
        successResponse(movieShowData[0], res);
      } else {
        throw new Error();
      }
    }
  } catch (error) {
    errorResponse({ error: "seat already booked" }, res, 501);
  }
};

module.exports = {
  updateTicket,
};
