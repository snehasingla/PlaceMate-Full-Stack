// models/SubjectProgress.js

const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, default: "article" },
  },
  { _id: false }
);

// Each topic within a subject that the user is tracking
const topicSchema = new mongoose.Schema({
  topicId: { type: String },
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
  completedSubtopics: [{ type: Number }],
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
    trackingEnabled: {
      type: Boolean,
      default: false,
    },
    resources: [resourceSchema],
    topics: [topicSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubjectProgress", subjectProgressSchema);
