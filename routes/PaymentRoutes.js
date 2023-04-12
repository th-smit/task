const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const { Payment } = require("../controller/PaymentController");

router.post("/create-payment-intent", Payment);

module.exports = router;
