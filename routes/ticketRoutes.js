const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  addTicket,
  getTickets,
  checkTicket,
  deleteTicket,
  changePandingStatus,
} = require("../controller/ticketController");

router.get("/", getTickets);
router.post("/checkticket", checkTicket);

router.post("/", addTicket);

router.put("/", changePandingStatus);

router.delete("/", deleteTicket);

module.exports = router;
