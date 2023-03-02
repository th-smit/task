const mongoose = require("mongoose");

//schema design
const TicketSchema = new mongoose.Schema(
  {
    user_name: {
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
    email: {
      type: String,
    },
    show_id: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ticket", TicketSchema);
