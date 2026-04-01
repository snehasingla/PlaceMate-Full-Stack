const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, "Please add a task title"],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['DSA', 'Core Subject', 'Revision', 'Mock Interview', 'Company Prep', 'Aptitude', 'Math', 'Custom'],
    default: 'Custom'
  },
  relatedSubject: {
    type: String,
    default: ''
  },
  relatedTopic: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: [true, "Task date is required"]
  },
  timeBlock: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Anytime'],
    default: 'Anytime'
  },
  exactTime: {
    type: String,
    default: ''
  },
  effort: {
    type: String,
    enum: ['Short', 'Medium', 'Long'],
    default: 'Medium'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  shouldGenerateRevision: {
    type: Boolean,
    default: false
  },
  carriedForwardFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },

  // ── Revision Fields ────────────────────────────────
  isRevision: {
    type: Boolean,
    default: false
  },
  sourceType: {
    type: String,
    enum: ['auto', 'custom'],
    default: 'auto'
  },
  sourceTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  revisionStage: {
    type: Number,
    default: 0
  },
  stageName: {
    type: String,
    default: ''
  },
  snoozedUntil: {
    type: Date,
    default: null
  },
  snoozeCount: {
    type: Number,
    default: 0
  },

  // ── Reflection & Confidence ────────────────────────
  confidence: {
    type: String,
    enum: ['Weak', 'Okay', 'Strong', null],
    default: null
  },
  needsMoreFocus: {
    type: Boolean,
    default: false
  },
  reflectionNote: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Task", taskSchema);
