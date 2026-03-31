const express = require("express");
const router = express.Router();
const { getSubjects, createSubject, upsertTopic, deleteTopic } = require("../controllers/subjectController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getSubjects).post(createSubject);
router.route("/:id/topics").put(upsertTopic);
router.route("/:id/topics/:topicId").delete(deleteTopic);

module.exports = router;
