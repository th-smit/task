const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const {
  getShow,
  addShow,
  updateShow,
  deleteShow,
} = require("../controller/showController");

router.get("/", getShow);

router.post("/", addShow);

router.put("/:id", updateShow);

router.delete("/:id", deleteShow);

module.exports = router;
