// controllers/noteController.js

const Note = require("../models/Note");
const ActivityLog = require("../models/ActivityLog");

// GET /api/notes
const getNotes = async (req, res) => {
  const { search, tag, subject, isPinned, isFlashcard } = req.query;
  const filter = { user: req.user._id };

  if (search) filter.title = { $regex: search, $options: "i" };
  if (tag) filter.tags = tag;
  if (subject) filter.subject = subject;
  if (isPinned === "true") filter.isPinned = true;
  if (isFlashcard === "true") filter.isFlashcard = true;

  // Pinned notes appear first
  const notes = await Note.find(filter).sort({ isPinned: -1, createdAt: -1 });
  res.json(notes);
};

// POST /api/notes
const createNote = async (req, res) => {
  const { title, content, tags, isImportant, isPinned, isFlashcard, subject } = req.body;

  const note = await Note.create({
    user: req.user._id,
    title, content, tags, isImportant, isPinned, isFlashcard, subject,
  });

  await ActivityLog.create({
    user: req.user._id,
    type: "noteCreated",
    description: `Created note: ${title}`,
  });

  res.status(201).json(note);
};

// PUT /api/notes/:id
const updateNote = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }
  Object.assign(note, req.body);
  const updated = await note.save();
  res.json(updated);
};

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }
  res.json({ message: "Note deleted" });
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
