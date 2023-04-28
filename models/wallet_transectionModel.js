const mongoose = require("mongoose");

//schema design
const UserSchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
    },
    amount: {
      type: Number,
    },
    promo_name: {
      type: String,
    },
    type: {
      type: String,
      enum: ["deposit", "withdraw"],
    },
    customer_id: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
