const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  addPromoCode,
  getPromoCode,
  editPromoCode,
} = require("../controller/promocodeController");

router.get("/:email?/:movie_title?", getPromoCode);

router.post("/", addPromoCode);

router.put("/:id", editPromoCode);

// router.delete("/:title", auth, deleteMovies);

module.exports = router;
