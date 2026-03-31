// models/ActivityLog.js
// Records every significant action a user takes (for dashboard feed + streak)

const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["dsaSolved", "subjectCompleted", "noteCreated", "mockDone", "appAdded"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // createdAt used for "recent activity" feed
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
