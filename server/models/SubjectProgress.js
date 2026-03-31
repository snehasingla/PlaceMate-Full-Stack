// models/SubjectProgress.js

const mongoose = require("mongoose");

// Each topic within a subject (e.g. "Process Scheduling" within OS)
const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["notStarted", "inProgress", "completed"],
    default: "notStarted",
  },
  confidence: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  notes: { type: String, default: "" },
  nextRevision: { type: Date },
});

// One SubjectProgress document per subject per user
const subjectProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    topics: [topicSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubjectProgress", subjectProgressSchema);
