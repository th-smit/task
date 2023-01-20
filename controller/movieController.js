const Model = require("../models/Movie");
const { success, error } = require("../utils/Response");
const {
  addMovieValidation,
  updateMovieValidation,
} = require("../middleware/validationMiddleware");

const getMovies = async (req, res) => {
  let sign = "-";
  if (Number(req.query.sort) == 1) {
    sign = "";
  }

  try {
    if (!req.query.sortedby) {
      req.query.sortedby = "updatedAt";
    } else {
      if (req.query.sortedby != "createdAt") {
        error("need to pass proper query string", res);
      }
    }

    const sortedData = await Model.find().sort("" + sign + req.query.sortedby);

    success(sortedData, res);
  } catch (err) {
    error(err, res);
  }
};

const addMovies = async (req, res) => {
  try {
    const value = await addMovieValidation.validateAsync(req.body);

    if (value) {
      const { title, description, is_released } = req.body;
      const data = new Model({
        title: title,
        description: description,
        is_released: is_released,
      });

      const moviesData = await data.save();
      success(moviesData, res);
    }
  } catch (err) {
    error(err.details[0]?.message, res);
  }
};

const findMovies = async (req, res) => {
  try {
    const moviesData = await Model.findById(req.params.id);
    success(moviesData, res);
  } catch (err) {
    error("id does not exist", res);
  }
};

const updateMovies = async (req, res) => {
  try {
    const moviesData = await Model.findById(req.params.id);

    if (!moviesData) {
      return error("id does not exist", res);
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
        await Model.findByIdAndUpdate(req.params.id, {
          $set: updatedMoviesData,
        });
        success(updatedMoviesData, res);
      }
    }
  } catch (err) {
    error(err.details[0]?.message, res);
  }
};

const deleteMovies = async (req, res) => {
  try {
    let moviesData = await Model.findById(req.params.id);

    if (!moviesData) {
      return error("id does not exist", res);
    }
    const resultedData = await Model.deleteOne({ _id: req.params.id });
    success(resultedData, res);
  } catch (err) {
    error(err, res);
  }
};

module.exports = {
  getMovies,
  findMovies,
  addMovies,
  updateMovies,
  deleteMovies,
};
