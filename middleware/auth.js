const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Show = require("../models/showModel");
const { errorResponse } = require("../utils/Response");
const auth = async (req, res, next) => {
  try {
    console.log("hello ", req.headers.authorization);
    const token = req.headers.authorization;
    const userData = jwt.verify(token, process.env.SECRET_KEY);
    const user = User.findOne({ email: userData.email });
    if (user) {
      next();
    } else errorResponse("unauthorize", res, 404);
  } catch (error) {
    errorResponse("token invalid", res, 500);
  }
};

module.exports = { auth };
