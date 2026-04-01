const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getReflection, saveReflection } = require("../controllers/reflectionController");

router.route("/")
  .get(protect, getReflection)
  .post(protect, saveReflection);

module.exports = router;
