const mongoose = require("mongoose");

//schema design
const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    poster_api: {
      type: String,
    },
    movie_type: {
      type: String,
    },
    language: {
      type: [String],
    },
    format: {
      type: [String],
    },
    hour: {
      type: String,
    },
    minute: {
      type: String,
    },
    date: {
      type: String,
    },
    is_released: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model("movies", MovieSchema);
