const express = require("express");
const {
  emailSend,
  otpVerify,
  changePassword,
} = require("../controller/otpController");

const router = express.Router();

router.post("/emailsend", emailSend);

router.post("/otpverify", otpVerify);

router.post("/changepassword", changePassword);

module.exports = router;
