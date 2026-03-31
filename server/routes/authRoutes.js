// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/logout", logoutUser); // Not async

// Protected routes (user must be logged in)
router.get("/me", protect, asyncHandler(getMe));
router.put("/me", protect, asyncHandler(updateProfile));

module.exports = router;
