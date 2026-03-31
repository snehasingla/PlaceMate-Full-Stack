// models/Note.js

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
    },
    content: { type: String, default: "" },
    tags: [{ type: String }],
    isImportant: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isFlashcard: { type: Boolean, default: false },
    subject: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
