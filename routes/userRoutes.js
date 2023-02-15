const express = require("express");
const { signUp, signIn, userDetails } = require("../controller/userController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/login", signIn);

router.post("/register", signUp);

router.put("/userDetails", auth, userDetails);

module.exports = router;
