const mongoose = require("mongoose");

//schema design
const UserPromoSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    promo_id: {
      type: String,
    },
    promo_name: {
      type: String,
    },
    movie_title: {
      type: String,
    },
    limit: {
      type: Number,
      default: 1,
    },
    saving: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userPromo", UserPromoSchema);
