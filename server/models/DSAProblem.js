// models/DSAProblem.js

const mongoose = require("mongoose");

const dsaProblemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Problem title is required"],
      trim: true,
    },
    link: {
      type: String,
      default: "",
    },
    topic: {
      type: String,
      required: [true, "Problem topic is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    status: {
      type: String,
      enum: ["notStarted", "inProgress", "solved", "reviseLater"],
      default: "notStarted",
    },
    notes: {
      type: String,
      default: "",
    },
    timesRevised: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DSAProblem", dsaProblemSchema);
