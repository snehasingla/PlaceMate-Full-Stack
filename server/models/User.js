// models/User.js
// Defines what a User document looks like in MongoDB

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Never returned in queries by default (security)
    },
    avatar: {
      type: String,
      default: "",
    },
    targetRole: {
      type: String,
      default: "SDE Intern",
    },
    targetDate: {
      type: Date,
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActivity: { type: Date },
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// MIDDLEWARE: Hash password before saving to DB
// This runs automatically before every .save() call
userSchema.pre("save", async function (next) {
  // Only hash if the password field was actually changed
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// METHOD: Compare entered password with stored hash
// Called in authController during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
