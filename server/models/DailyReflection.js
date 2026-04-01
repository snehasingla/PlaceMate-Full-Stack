const mongoose = require("mongoose");

const dailyReflectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD string — avoids UTC boundary edge cases
    required: true,
  },
  wentWell: { type: String, default: "" },
  skipped: { type: String, default: "" },
  focusTomorrow: { type: String, default: "" },
}, { timestamps: true });

// One reflection per user per date
dailyReflectionSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyReflection", dailyReflectionSchema);
