const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  addTicket,
  getTicket,
  checkTicket,
  deleteTicket,
} = require("../controller/ticketController");

router.get("/", getTicket);
router.post("/checkticket", checkTicket);

router.post("/", addTicket);

router.delete("/", deleteTicket);

module.exports = router;
