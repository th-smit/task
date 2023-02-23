const mongoose = require("mongoose");

//schema design
const ShowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    time: {
      type: String,
    },
    seat: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("show", ShowSchema);
