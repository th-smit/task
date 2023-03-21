const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  addPromoCode,
  getPromoCode,
} = require("../controller/promocodeController");

router.get("/:id?", getPromoCode);

router.post("/", addPromoCode);

// router.put("/:id", updateMovies);

// router.delete("/:title", auth, deleteMovies);

module.exports = router;
