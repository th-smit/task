const Movie = require("../models/movieModel");

const { successResponse, errorResponse } = require("../utils/Response");
const {
  addMovieValidation,
  updateMovieValidation,
} = require("../middleware/validationMiddleware");

const getMovies = async (req, res) => {
  try {
    const sortedData = await Movie.find({
      title: { $regex: req.query.title, $options: "i" },
    }).sort(req.query.sortedby);
    successResponse(sortedData, res);
  } catch (err) {
    errorResponse(err, res, 404);
  }
};

const addMovies = async (req, res) => {
  console.log(req.body);
  try {
    const value = await addMovieValidation.validateAsync(req.body);
    if (value) {
      const dataObj = new Movie({
        title: req.body.title,
        description: req.body.description,
        poster_api: req.body.poster_api,
        movie_type: req.body.movie_type,
        is_released: req.body.is_released,
      });

      const moviesData = await dataObj.save();
      successResponse(moviesData, res);
    }
  } catch (err) {
    errorResponse(err.details[0]?.message, res, 501);
  }
};

const updateMovies = async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  try {
    const moviesData = await Movie.findOne({ _id: req.params.id });
    console.log(moviesData);
    if (!moviesData) {
      errorResponse("title does not exist", res, 404);
    } else {
      const updatedMoviesData = moviesData;

      if (req.body.title) {
        updatedMoviesData.title = req.body.title;
      }
      if (req.body.description) {
        updatedMoviesData.description = req.body.description;
      }
      if (req.body.poster_api) {
        updatedMoviesData.poster_api = req.body.poster_api;
      }
      if (req.body.movie_type) {
        updatedMoviesData.is_released = req.body.movie_type;
      }
      if (req.body.is_released) {
        updatedMoviesData.is_released = req.body.is_released;
      }

      const value = await updateMovieValidation.validateAsync(req.body);

      if (value) {
        await Movie.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: updatedMoviesData,
          },
          { New: true }
        );
        successResponse(updatedMoviesData, res);
      }
    }
  } catch (err) {
    errorResponse(err, res, 500);
  }
};

const deleteMovies = async (req, res) => {
  console.log("from deleteMovies  " + req.params.title);
  try {
    // await Movie.findById(req.body.userEmail);
    const resultedData = await Movie.deleteOne({ title: req.params.title });
    successResponse(resultedData, res);
  } catch (err) {
    errorResponse("id does not exist", res, 500);
  }
};

module.exports = {
  getMovies,
  addMovies,
  updateMovies,
  deleteMovies,
};
