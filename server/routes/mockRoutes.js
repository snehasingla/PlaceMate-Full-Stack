const express = require("express");
const router = express.Router();
const { getQuestions, addQuestion, getSessions, createSession, updateSession } = require("../controllers/mockController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/questions").get(getQuestions).post(addQuestion);
router.route("/sessions").get(getSessions).post(createSession);
router.route("/sessions/:id").put(updateSession);

module.exports = router;
