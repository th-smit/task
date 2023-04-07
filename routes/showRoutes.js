const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  getShow,
  getShowSeat,
  getMovieId,
  addShow,
  updateShow,
  deleteShow,
} = require("../controller/showController");

router.get("/", getShow);
router.get("/seat/:id", getShowSeat);
router.get("/movieid/:id", getMovieId);
router.post("/", addShow);

router.put("/:id", updateShow);

router.delete("/:id", deleteShow);

module.exports = router;
