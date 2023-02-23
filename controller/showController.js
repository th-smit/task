const Show = require("../models/showModel");

const { successResponse, errorResponse } = require("../utils/Response");
const {
  addShowValidation,
  updateMovieValidation,
} = require("../middleware/validationMiddleware");

const getShow = async (req, res) => {
  try {
    console.log(req.query.title);
    const sortedData = await Show.find({ title: req.query.title });
    console.log(sortedData);
    successResponse(sortedData, res);
  } catch (err) {
    errorResponse(err, res, 404);
  }
};

const addShow = async (req, res) => {
  console.log(req.body);
  try {
    const value = await addShowValidation.validateAsync(req.body);
    console.log(value);
    if (value) {
      const dataObj = new Show({
        title: req.body.title,
        time: req.body.time,
      });
      console.log("showObj " + dataObj);
      const showData = await dataObj.save();
      successResponse(showData, res);
    }
  } catch (err) {
    errorResponse(err.details[0]?.message, res, 501);
  }
};

// const updateMovies = async (req, res) => {
//   console.log("from backend" + req.body);
//   console.log(req.params.id);
//   try {
//     const moviesData = await Movie.findOne({ _id: req.params.id });
//     console.log(moviesData);
//     if (!moviesData) {
//       errorResponse("title does not exist", res, 404);
//     } else {
//       const updatedMoviesData = moviesData;

//       if (req.body.title) {
//         updatedMoviesData.title = req.body.title;
//       }
//       if (req.body.description) {
//         updatedMoviesData.description = req.body.description;
//       }
//       if (req.body.poster_api) {
//         updatedMoviesData.poster_api = req.body.poster_api;
//       }
//       if (req.body.movie_type) {
//         updatedMoviesData.movie_type = req.body.movie_type;
//       }
//       if (req.body.is_released) {
//         updatedMoviesData.is_released = req.body.is_released;
//       }
//       if (req.body.language) {
//         updatedMoviesData.language = req.body.language;
//       }
//       if (req.body.format) {
//         updatedMoviesData.format = req.body.format;
//       }
//       if (req.body.hour) {
//         updatedMoviesData.hour = req.body.hour;
//       }
//       if (req.body.minute) {
//         updatedMoviesData.minute = req.body.minute;
//       }
//       if (req.body.date) {
//         updatedMoviesData.date = req.body.date;
//       }

//       const value = await updateMovieValidation.validateAsync(req.body);

//       if (value) {
//         await Movie.findOneAndUpdate(
//           { _id: req.params.id },
//           {
//             $set: updatedMoviesData,
//           },
//           { New: true }
//         );
//         successResponse(updatedMoviesData, res);
//       }
//     }
//   } catch (err) {
//     errorResponse(err, res, 500);
//   }
// };

// const deleteMovies = async (req, res) => {
//   console.log("from deleteMovies  " + req.params.title);
//   try {
//     // await Movie.findById(req.body.userEmail);
//     const resultedData = await Movie.deleteOne({ title: req.params.title });
//     successResponse(resultedData, res);
//   } catch (err) {
//     errorResponse("id does not exist", res, 500);
//   }
// };

module.exports = {
  getShow,
  addShow,
  //   updateMovies,
  //   deleteMovies,
};
