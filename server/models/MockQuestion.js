// models/MockQuestion.js

const mongoose = require("mongoose");

const mockQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    type: {
      type: String,
      enum: ["technical", "hr", "behavioral"],
      required: true,
    },
    subject: { type: String, default: "General" },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    tags: [{ type: String }],
    isGlobal: { type: Boolean, default: false }, // true = seeded question, visible to all
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockQuestion", mockQuestionSchema);
