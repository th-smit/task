const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  addPromoCode,
  getPromoCode,
  editPromoCode,
  getUserPromo,
} = require("../controller/promocodeController");

router.get("/:email?", getPromoCode);

router.get("/promo/:email?", getUserPromo);

router.post("/", addPromoCode);

router.put("/:id", editPromoCode);

// router.delete("/:title", auth, deleteMovies);

module.exports = router;
