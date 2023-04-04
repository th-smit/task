const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  addPromoCode,
  getPromoCode,
  editPromoCode,
  deletePromoCode,
  getUserPromo,
} = require("../controller/promocodeController");

router.get("/getuserpromodata", getUserPromo);
router.get("/:email?/:movie_title?", getPromoCode);

router.post("/", addPromoCode);

router.put("/:id", editPromoCode);

router.delete("/:promo_name", deletePromoCode);

module.exports = router;
