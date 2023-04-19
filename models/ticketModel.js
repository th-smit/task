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
    discount: {
      type: Number,
      default: null,
    },
    promo_name: {
      type: String,
      default: null,
    },
    pending_status: {
      type: Boolean,
      default: true,
    },
    poster_api: {
      type: String,
    },
    payment_intentkey: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ticket", TicketSchema);
