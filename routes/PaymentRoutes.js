const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const { Payment } = require("../controller/PaymentController");

router.post("/create-payment-intent/:ticketid?", Payment);

module.exports = router;
