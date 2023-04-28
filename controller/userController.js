const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const { successResponse, errorResponse } = require("../utils/Response");

const {
  registerUserValidation,
} = require("../middleware/validationMiddleware");

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    const validateUser = await registerUserValidation.validateAsync(req.body);

    if (existingUser && validateUser) {
      errorResponse("User already exist", res, 400);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const customer = await stripe.customers.create({
        email: email,
        name: name,
      });
      const newUserData = new User({
        name,
        email,
        password: hashedPassword,
        customer_id: customer.id,
      });

      const token = jwt.sign(
        {
          email: email,
        },
        process.env.SECRET_KEY
      );
      await newUserData.save();
      successResponse({ user: newUserData, token: token }, res);
    }
  } catch (error) {
    errorResponse(error.message, res, 500);
  }
};

const signIn = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    const matchPassword = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );

    if (!existingUser || !matchPassword) {
      // existingUser.role !== req.body.role
      errorResponse("Invalid Credential", res, 404);
    } else {
      const token = jwt.sign(
        {
          email: existingUser.email,
        },
        process.env.SECRET_KEY
      );
      successResponse({ user: existingUser, token }, res);
    }
  } catch (err) {
    errorResponse("something went wrong", res, 500);
  }
};

const userDetails = async (req, res) => {
  const { email, name } = req.body;
  try {
    await User.findOneAndUpdate({ email: req.body.email }, { name: name });
    successResponse("data updated successfully", res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signIn,
  signUp,
  userDetails,
};
