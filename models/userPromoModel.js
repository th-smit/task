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
    limit: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userPromo", UserPromoSchema);
