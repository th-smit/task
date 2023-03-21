const mongoose = require("mongoose");

//schema design
const promocodeSchema = new mongoose.Schema(
  {
    promo_name: {
      type: String,
    },
    expiry_date: {
      type: Date,
    },
    limit: {
      type: Number,
    },
    promocode_type: {
      type: String,
    },
    active_status: {
      type: Boolean,
    },
    movies: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("promocode", promocodeSchema);
