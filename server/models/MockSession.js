// models/MockSession.js

const mongoose = require("mongoose");

// Each answer entry in a session
const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: "MockQuestion" },
  answer: { type: String, default: "" },
  selfRating: { type: Number, min: 1, max: 5, default: 3 },
});

const mockSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // e.g. "Google SWE Prep - Round 1"
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "MockQuestion" }],
    answers: [answerSchema],
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockSession", mockSessionSchema);
