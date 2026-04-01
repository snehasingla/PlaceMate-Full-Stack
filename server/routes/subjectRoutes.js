const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const {
  getSubjects,
  getSubjectProgress,
  createSubject,
  upsertTopic,
  updateResources,
  updateTracking,
  deleteTopic,
} = require("../controllers/subjectController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(asyncHandler(getSubjects)).post(asyncHandler(createSubject));
router.route("/progress").get(asyncHandler(getSubjectProgress));
router.route("/:id/topics").put(asyncHandler(upsertTopic));
router.route("/:id/resources").put(asyncHandler(updateResources));
router.route("/:id/tracking").put(asyncHandler(updateTracking));
router.route("/:id/topics/:topicId").delete(asyncHandler(deleteTopic));

module.exports = router;
