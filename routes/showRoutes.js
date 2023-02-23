const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();

const { getShow, addShow } = require("../controller/showController");

router.get("/", getShow);

router.post("/", addShow);

// router.put("/:id", auth, updateShow);

// router.delete("/:title", auth, deleteShow);

module.exports = router;
