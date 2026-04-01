// controllers/authController.js
// Handles: register, login, logout, getMe, updateProfile

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const normalizeDate = (date) => {
  const dt = new Date(date);
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

const updateUserStreak = async (user) => {
  const today = normalizeDate(new Date());
  const lastActivity = user.streak?.lastActivity ? normalizeDate(user.streak.lastActivity) : null;

  // If we already recorded activity today, do nothing.
  if (lastActivity && lastActivity.getTime() === today.getTime()) {
    return user;
  }

  if (!user.streak) {
    user.streak = { current: 0, longest: 0 };
  }

  // If last activity was yesterday, continue the streak. Otherwise start over.
  if (lastActivity && lastActivity.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
    user.streak.current = (user.streak.current || 0) + 1;
  } else {
    user.streak.current = 1;
  }

  user.streak.longest = Math.max(user.streak.longest || 0, user.streak.current);
  user.streak.lastActivity = today;

  await user.save();
  return user;
};

// ─── REGISTER ───────────────────────────────────────────────────────────────
// POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, rememberMe } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // Create new user (password gets hashed by the pre-save hook in User.js)
  let user = await User.create({ name, email, password });

  user = await updateUserStreak(user);
  generateToken(res, user._id, rememberMe);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    targetRole: user.targetRole,
    streak: user.streak,
  });
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
// POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // .select("+password") overrides the schema's select:false
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  await updateUserStreak(user);
  generateToken(res, user._id, rememberMe);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    targetRole: user.targetRole,
    streak: user.streak,
  });
};

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
// POST /api/auth/logout
const logoutUser = (req, res) => {
  // Clear the cookie by setting its expiry to the past
  res.cookie("prepwork_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
};

// ─── GET CURRENT USER ─────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  // req.user is attached by the protect middleware
  const user = await updateUserStreak(req.user);
  res.json(user);
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
// PUT /api/auth/me  (protected)
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Only update fields that were sent in the request
  user.name = req.body.name || user.name;
  user.targetRole = req.body.targetRole || user.targetRole;
  user.targetDate = req.body.targetDate || user.targetDate;
  user.avatar = req.body.avatar || user.avatar;

  // If a new password is sent, update it (pre-save hook will re-hash it)
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    targetRole: updatedUser.targetRole,
    targetDate: updatedUser.targetDate,
    avatar: updatedUser.avatar,
    streak: updatedUser.streak,
  });
};

module.exports = { registerUser, loginUser, logoutUser, getMe, updateProfile };
