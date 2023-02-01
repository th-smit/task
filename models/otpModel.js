const mongoose = require("mongoose");

//schema design
const otpschema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    code: {
      type: String,
    },
    expireIn: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", otpschema);
