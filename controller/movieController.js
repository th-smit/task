const Movie = require("../models/movieModel");

const { successResponse, errorResponse } = require("../utils/Response");
const {
  addMovieValidation,
  updateMovieValidation,
} = require("../middleware/validationMiddleware");

const getMovies = async (req, res) => {
  try {
    const sortedData = await Movie.find().sort(req.query.sortedby);
    successResponse(sortedData, res);
  } catch (err) {
    errorResponse(err, res, 404);
  }
};

const addMovies = async (req, res) => {
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

const findMovies = async (req, res) => {
  try {
    const moviesData = await Movie.findOne({ title: req.params.title });
    successResponse(moviesData, res);
  } catch (err) {
    errorResponse("does not exist", res, 404);
  }
};

const updateMovies = async (req, res) => {
  try {
    const moviesData = await Movie.findById(req.params.id);

    if (!moviesData) {
      errorResponse("id does not exist", res, 404);
    } else {
      const updatedMoviesData = moviesData;

      if (req.body.title) {
        updatedMoviesData.title = req.body.title;
      }
      if (req.body.description) {
        updatedMoviesData.description = req.body.description;
      }
      if (req.body.is_released) {
        updatedMoviesData.is_released = req.body.is_released;
      }

      const value = await updateMovieValidation.validateAsync(req.body);

      if (value) {
        await Movie.findByIdAndUpdate(
          req.params.id,
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
  try {
    await Movie.findById(req.params.id);
    const resultedData = await Movie.deleteOne({ _id: req.params.id });
    successResponse(resultedData, res);
  } catch (err) {
    errorResponse("id does not exist", res, 500);
  }
};

module.exports = {
  getMovies,
  findMovies,
  addMovies,
  updateMovies,
  deleteMovies,
};
