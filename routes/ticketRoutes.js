const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const { updateTicket } = require("../controller/ticketController");

// router.get("/", getShow);
//router.post("/", addTicket);

router.put("/", updateTicket);

// router.delete("/:title", auth, deleteShow);

module.exports = router;
