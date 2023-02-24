const Show = require("../models/showModel");

const { successResponse, errorResponse } = require("../utils/Response");
const {
  addShowValidation,
  updateShowValidation,
} = require("../middleware/validationMiddleware");

const getShow = async (req, res) => {
  try {
    // console.log("date formate " + new Date(req.query.date));
    console.log(req.query.title);
    const sortedData = await Show.find({ title: req.query.title });
    successResponse(sortedData, res);
  } catch (err) {
    errorResponse(err, res, 404);
  }
};

const addShow = async (req, res) => {
  console.log(req.body);
  console.log("show date " + req.body.datetime);
  console.log(typeof req.body.datetime);
  try {
    const value = await addShowValidation.validateAsync(req.body);
    console.log(value);
    if (value) {
      const dataObj = new Show({
        title: req.body.title,
        datetime: req.body.datetime,
      });
      console.log("showObj " + dataObj);
      const showData = await dataObj.save();
      successResponse(showData, res);
    }
  } catch (err) {
    errorResponse(err.details[0]?.message, res, 501);
  }
};

const updateShow = async (req, res) => {
  console.log("from backend" + req.body);
  //console.log("movie id " + req.body.movieid);
  console.log("show date " + req.body.datetime);
  console.log(typeof req.body.datetime);

  try {
    const moviesData = await Show.findOne({ _id: req.params.id });
    console.log(moviesData);
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
      console.log(value);
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
  updateShow,
  //   deleteMovies,
};
