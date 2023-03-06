const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  getShow,
  getShowSeat,
  addShow,
  updateShow,
  deleteShow,
} = require("../controller/showController");

router.get("/", getShow);
router.get("/seat/:id", getShowSeat);
router.post("/", addShow);

router.put("/:id", updateShow);

router.delete("/:id", deleteShow);

module.exports = router;
