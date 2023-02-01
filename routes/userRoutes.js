const express = require("express");
const { signUp, signIn } = require("../controller/userController");

const router = express.Router();

router.post("/login", signIn);

router.post("/register", signUp);

module.exports = router;
