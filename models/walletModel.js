const mongoose = require("mongoose");

//schema design
const WalletSchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
    },
    balance: {
      type: Number,
      //   unique: true,
    },
    // password: {
    //   type: String,
    // },
    // role: {
    //   type: String,
    //   default: "user",
    // },
    // customer_id: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", WalletSchema);
