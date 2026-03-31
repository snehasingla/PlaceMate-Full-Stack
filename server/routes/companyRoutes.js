const express = require("express");
const router = express.Router();
const { getApplications, addApplication, updateApplication, deleteApplication } = require("../controllers/companyController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getApplications).post(addApplication);
router.route("/:id").put(updateApplication).delete(deleteApplication);

module.exports = router;
