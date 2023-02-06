const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const { errorResponse } = require("../utils/Response");
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const userData = jwt.verify(token, process.env.SECRET_KEY);
    const user = User.findOne({ email: userData.email });
    if (user) {
      next();
    } else errorResponse("unauthorize", res, 404);
  } catch (error) {
    errorResponse(error, res, 500);
  }
};

module.exports = { auth };
