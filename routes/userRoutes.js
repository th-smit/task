const express = require("express");
const { signUp, signIn } = require("../controller/userController");

const router = express.Router();

router.get("/signin", signIn);

router.post("/signup", signUp);

module.exports = router;
