const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const {
  forgotPasswordValidation,
} = require("../middleware/validationMiddleware");
const { successResponse, errorResponse } = require("../utils/Response");

const mailer = async (email, code) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "skpatel30092001@gmail.com",
      pass: process.env.Password,
    },
  });

  const mailOptions = {
    from: '"Book My Show" <skpatel30092001@gmail.com>',
    to: email,
    subject: "OTP",
    text: code,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("email sent to the " + email); //
    }
  });
};

const emailSend = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });

    if (userData) {
      const otp = Math.floor(Math.random() * 1000000 + 1); //6 digit otp

      const otpData = new Otp({
        email: req.body.email,
        code: otp,
        expireIn: new Date().getTime() + 300 * 1000, //5 min expire time
      });

      await otpData.save();
      mailer(otpData.email, otpData.code.toString());
      successResponse("please check your mail", res);
    } else {
      errorResponse("id does not exist", res, 404);
    }
  } catch (error) {
    errorResponse(error, res, 500);
  }
};
const otpVerify = async (req, res) => {
  try {
    const data = await Otp.findOne({
      email: req.body.email,
      code: req.body.otp,
    });
    console.log(data);
    if (data) {
      const currentTime = new Date().getTime();
      const otpLife = data.expireIn - currentTime;
      console.log(otpLife);
      if (otpLife < 0) {
        errorResponse("otp life has been expire", res, 400);
      } else {
        successResponse("otp verified", res);
      }
      await Otp.remove({ email: req.body.email });
    } else {
      errorResponse("invalid creditials", res, 400);
    }
  } catch (error) {
    errorResponse(error, res, 404);
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      await forgotPasswordValidation.validateAsync(req.body);
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
      user.save();
      successResponse("password changed successfully ", res);
    } else {
      errorResponse("email not exist", res, 404);
    }
  } catch (error) {
    errorResponse(error.message, res, 500);
  }
};

module.exports = {
  emailSend,
  otpVerify,
  changePassword,
};
