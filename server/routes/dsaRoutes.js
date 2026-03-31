const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const { getProblems, addProblem, getProblem, updateProblem, deleteProblem } = require("../controllers/dsaController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All DSA routes require login

router.route("/").get(asyncHandler(getProblems)).post(asyncHandler(addProblem));
router.route("/:id").get(asyncHandler(getProblem)).put(asyncHandler(updateProblem)).delete(asyncHandler(deleteProblem));

module.exports = router;
