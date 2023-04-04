const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  getMovies,
  addMovies,
  updateMovies,
  deleteMovies,
} = require("../controller/movieController");

router.get("/", getMovies);

router.post("/", addMovies);

router.put("/:id", updateMovies);

router.delete("/:title", deleteMovies);

module.exports = router;
