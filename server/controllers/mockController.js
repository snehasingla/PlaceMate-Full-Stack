// controllers/mockController.js

const MockQuestion = require("../models/MockQuestion");
const MockSession = require("../models/MockSession");
const ActivityLog = require("../models/ActivityLog");

// ─── QUESTIONS ────────────────────────────────────────────────────────────────

// GET /api/mock/questions
const getQuestions = async (req, res) => {
  const { type, subject, difficulty, search } = req.query;

  // Show global seeded questions + questions created by this user
  const filter = {
    $or: [{ isGlobal: true }, { createdBy: req.user._id }],
  };
  if (type) filter.type = type;
  if (subject) filter.subject = subject;
  if (difficulty) filter.difficulty = difficulty;
  if (search) filter.question = { $regex: search, $options: "i" };

  const questions = await MockQuestion.find(filter).sort({ createdAt: -1 });
  res.json(questions);
};

// POST /api/mock/questions  — Add a custom question
const addQuestion = async (req, res) => {
  const { question, type, subject, difficulty, tags } = req.body;
  const newQ = await MockQuestion.create({
    question, type, subject, difficulty, tags,
    isGlobal: false,
    createdBy: req.user._id,
  });
  res.status(201).json(newQ);
};

// ─── SESSIONS ─────────────────────────────────────────────────────────────────

// GET /api/mock/sessions
const getSessions = async (req, res) => {
  const sessions = await MockSession.find({ user: req.user._id })
    .populate("questions", "question type subject")
    .sort({ createdAt: -1 });
  res.json(sessions);
};

// POST /api/mock/sessions  — Create a new session
const createSession = async (req, res) => {
  const { name, questions } = req.body;
  const session = await MockSession.create({
    user: req.user._id,
    name,
    questions,
    answers: [],
  });
  res.status(201).json(session);
};

// PUT /api/mock/sessions/:id  — Submit answers for a session
const updateSession = async (req, res) => {
  const session = await MockSession.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  if (req.body.answers) session.answers = req.body.answers;
  if (req.body.completedAt) session.completedAt = req.body.completedAt;

  const updated = await session.save();

  // Log completed session
  if (updated.completedAt) {
    await ActivityLog.create({
      user: req.user._id,
      type: "mockDone",
      description: `Completed mock session: ${updated.name}`,
    });
  }

  res.json(updated);
};

module.exports = { getQuestions, addQuestion, getSessions, createSession, updateSession };
