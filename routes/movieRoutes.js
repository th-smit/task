const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  getMovies,
  findMovies,
  addMovies,
  updateMovies,
  deleteMovies,
} = require("../controller/movieController");

router.get("/", auth, getMovies);

router.get("/:title", findMovies);

router.post("/", addMovies);

router.put("/:id", updateMovies);

router.delete("/:id", deleteMovies);

module.exports = router;
