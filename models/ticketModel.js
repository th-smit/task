const mongoose = require("mongoose");

//schema design
const TicketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    movie_title: {
      type: String,
    },
    seat: {
      type: Array,
    },
    show_datetime: {
      type: Date,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ticket", TicketSchema);
