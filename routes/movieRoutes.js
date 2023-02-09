const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  getMovies,
  addMovies,
  updateMovies,
  deleteMovies,
} = require("../controller/movieController");

router.get("/", auth, getMovies);

router.post("/", addMovies);

router.put("/:email", updateMovies);

router.delete("/:title", deleteMovies);

module.exports = router;
