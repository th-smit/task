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
    is_released: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model("movies", MovieSchema);
