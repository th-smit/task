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
    is_verified: {
      type: Boolean,
      default: false,
    },
    expireIn: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", otpschema);
