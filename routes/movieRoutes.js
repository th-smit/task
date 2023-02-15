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

router.post("/", auth, addMovies);

router.put("/:id", auth, updateMovies);

router.delete("/:title", auth, deleteMovies);

module.exports = router;
