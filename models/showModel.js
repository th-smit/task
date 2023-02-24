const { string } = require("joi");
const mongoose = require("mongoose");

//schema design
const ShowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    seat: {
      type: Array,
    },
    datetime: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("show", ShowSchema);
