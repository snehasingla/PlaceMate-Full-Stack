// controllers/dsaController.js

const DSAProblem = require("../models/DSAProblem");
const ActivityLog = require("../models/ActivityLog");

// GET /api/dsa  — Get all problems for the logged-in user (with filter/search/sort)
const getProblems = async (req, res) => {
  const { topic, difficulty, status, search, sort } = req.query;

  // Build a dynamic filter object
  const filter = { user: req.user._id };
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;
  if (status) filter.status = status;
  if (search) filter.title = { $regex: search, $options: "i" }; // case-insensitive search

  // Build sort option
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (sort === "difficulty") sortOption = { difficulty: 1 };
  if (sort === "topic") sortOption = { topic: 1 };
  if (sort === "status") sortOption = { status: 1 };

  const problems = await DSAProblem.find(filter).sort(sortOption);
  res.json(problems);
};

// POST /api/dsa  — Add a new problem
const addProblem = async (req, res) => {
  const { title, link, topic, difficulty, status, notes } = req.body;

  const problem = await DSAProblem.create({
    user: req.user._id,
    title,
    link,
    topic,
    difficulty,
    status: status || "notStarted",
    notes,
  });

  // Log this activity for the dashboard feed
  if (status === "solved") {
    await ActivityLog.create({
      user: req.user._id,
      type: "dsaSolved",
      description: `Solved: ${title}`,
    });
  }

  res.status(201).json(problem);
};

// GET /api/dsa/:id  — Get one problem
const getProblem = async (req, res) => {
  const problem = await DSAProblem.findOne({ _id: req.params.id, user: req.user._id });
  if (!problem) {
    res.status(404);
    throw new Error("Problem not found");
  }
  res.json(problem);
};

// PUT /api/dsa/:id  — Update a problem
const updateProblem = async (req, res) => {
  const problem = await DSAProblem.findOne({ _id: req.params.id, user: req.user._id });
  if (!problem) {
    res.status(404);
    throw new Error("Problem not found");
  }

  const wasNotSolved = problem.status !== "solved";
  const isNowSolved = req.body.status === "solved";

  Object.assign(problem, req.body);
  const updated = await problem.save();

  // Log when a problem is newly marked as solved
  if (wasNotSolved && isNowSolved) {
    await ActivityLog.create({
      user: req.user._id,
      type: "dsaSolved",
      description: `Solved: ${updated.title}`,
    });
  }

  res.json(updated);
};

// DELETE /api/dsa/:id  — Delete a problem
const deleteProblem = async (req, res) => {
  const problem = await DSAProblem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!problem) {
    res.status(404);
    throw new Error("Problem not found");
  }
  res.json({ message: "Problem deleted" });
};

module.exports = { getProblems, addProblem, getProblem, updateProblem, deleteProblem };
