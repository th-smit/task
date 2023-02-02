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
      console.log("Email Sent To The " + email); //
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
      successResponse("Please Check Your Mail", res);
    } else {
      errorResponse("Email Does Not Exist", res, 404);
    }
  } catch (error) {
    errorResponse(error, res, 500);
  }
};
const otpVerify = async (req, res) => {
  try {
    const otpData = await Otp.findOne({
      email: req.body.email,
      code: req.body.otp,
    });
    if (otpData) {
      const currentTime = new Date().getTime();
      const otpLife = otpData.expireIn - currentTime;
      console.log(otpLife);
      if (otpLife < 0) {
        errorResponse("Otp Life Has Been Expire", res, 400);
      } else {
        if (otpData.code === req.body.otp) {
          otpData.is_verified = true;
          otpData.save();
          successResponse("Otp Verified", res);
        } else {
          errorResponse("Invalid Otp", res, 401);
        }
      }
    } else {
      errorResponse("Invalid Creditials", res, 400);
    }
  } catch (error) {
    errorResponse(error, res, 404);
  }
};

const changePassword = async (req, res) => {
  try {
    const otpData = await Otp.findOne({ email: req.body.email });
    if (otpData.is_verified === true) {
      await forgotPasswordValidation.validateAsync(req.body);

      const userData = await User.findOne({ email: req.body.email });
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      userData.password = hashedPassword;
      userData.save();
      await Otp.remove({ email: req.body.email });
      successResponse("Password Changed Successfully ", res);
    } else {
      errorResponse("Email Not Verified", res, 404);
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
