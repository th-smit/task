const Movie = require("../models/movieModel");
const Show = require("../models/showModel");
const PromoCode = require("../models/promocodeModel");
const { successResponse, errorResponse } = require("../utils/Response");
const {
  addMovieValidation,
  updateMovieValidation,
} = require("../middleware/validationMiddleware");

const getMovies = async (req, res) => {
  try {
    // if (!req.query.title) {
    if (req.query.title === null || req.query.title === undefined) {
      const sortedData = await Movie.find();
      successResponse(sortedData, res);
    } else {
      const sortedData = await Movie.find({
        title: { $regex: req.query.title, $options: "i" },
      }).sort(req.query.sortedby);
      successResponse(sortedData, res);
    }

    // } else {
    //   const movieData = await Movie.find();
    //   successResponse(movieData, res);
    // }
  } catch (error) {
    errorResponse(error, res, 404);
  }
};

const addMovies = async (req, res) => {
  try {
    const movieData = await Movie.find({ title: req.body.title });

    if (movieData.length === 0) {
      const value = await addMovieValidation.validateAsync(req.body);
      if (value) {
        const dataObj = new Movie({
          title: req.body.title,
          description: req.body.description,
          poster_api: req.body.poster_api,
          movie_type: req.body.movie_type,
          is_released: req.body.is_released,
          language: req.body.language,
          format: req.body.format,
          hour: req.body.hour,
          minute: req.body.minute,
          date: req.body.date,
        });
        const moviesData = await dataObj.save();
        successResponse(moviesData, res);
      }
    } else {
      errorResponse("same movie name already Exist ", res, 501);
    }
  } catch (err) {
    errorResponse(err.details[0]?.message, res, 501);
  }
};

const updateMovies = async (req, res) => {
  try {
    const moviesData = await Movie.findOne({ _id: req.params.id });
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
        updatedMoviesData.movie_type = req.body.movie_type;
      }
      if (req.body.is_released) {
        updatedMoviesData.is_released = req.body.is_released;
      }
      if (req.body.language) {
        updatedMoviesData.language = req.body.language;
      }
      if (req.body.format) {
        updatedMoviesData.format = req.body.format;
      }
      if (req.body.hour) {
        updatedMoviesData.hour = req.body.hour;
      }
      if (req.body.minute) {
        updatedMoviesData.minute = req.body.minute;
      }
      if (req.body.date) {
        updatedMoviesData.date = req.body.date;
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
  try {
    const movieShow = await Show.findOne({ title: req.params.title });
    if (movieShow) {
      errorResponse("show is available so can't delete the movie", res, 501);
    } else {
      const moviepromo = await PromoCode.find({
        movies: { $in: req.params.title },
      });

      moviepromo.map(async (data) => {
        const filteredArray = data.movies.filter(
          (items) => items !== req.params.title
        );
        // eslint-disable-next-line no-param-reassign
        data.movies = filteredArray;
        await PromoCode.findOneAndUpdate(
          { promo_name: data.promo_name },
          { $set: data },
          { New: true }
        );
      });

      // another way to delete movie from the promos
      // await PromoCode.updateMany(
      //   { movies: { $in: [req.params.title] } },
      //   { $pull: { movies: req.params.title } }
      // );

      await Movie.deleteOne({ title: req.params.title });

      successResponse("updated successfully ", res);
    }
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
