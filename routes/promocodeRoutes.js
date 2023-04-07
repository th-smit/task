const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  addPromoCode,
  getPromoCode,
  editPromoCode,
  deletePromoCode,
  getUserPromo,
  getMoviePromo,
  getSaving,
  getUserNameHighestTimeUsedPC,
} = require("../controller/promocodeController");

router.get("/getuserpromodata", getUserPromo);
router.get("/getUserNameHighestTimeUsedPC", getUserNameHighestTimeUsedPC);
router.get("/getmoviepromo", getMoviePromo);
router.get("/getsaving", getSaving);
router.get("/:email?/:movie_title?", getPromoCode);

router.post("/", addPromoCode);

router.put("/:id", editPromoCode);

router.delete("/:promo_name", deletePromoCode);

module.exports = router;
