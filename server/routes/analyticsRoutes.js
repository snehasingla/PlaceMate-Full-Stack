const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getDSAAnalytics,
  getSubjectAnalytics,
  getCompanyAnalytics,
  getActivityAnalytics,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/dashboard", getDashboardStats);
router.get("/dsa", getDSAAnalytics);
router.get("/subjects", getSubjectAnalytics);
router.get("/companies", getCompanyAnalytics);
router.get("/activity", getActivityAnalytics);

module.exports = router;
