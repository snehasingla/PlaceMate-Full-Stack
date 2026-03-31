// controllers/subjectController.js

const SubjectProgress = require("../models/SubjectProgress");
const ActivityLog = require("../models/ActivityLog");

// GET /api/subjects  — Get all subject docs for this user
const getSubjects = async (req, res) => {
  const subjects = await SubjectProgress.find({ user: req.user._id });
  res.json(subjects);
};

// POST /api/subjects  — Create a new subject doc (e.g. initialize "OS" for a user)
const createSubject = async (req, res) => {
  const { subject, topics } = req.body;

  // Don't allow duplicates per user
  const existing = await SubjectProgress.findOne({ user: req.user._id, subject });
  if (existing) {
    res.status(400);
    throw new Error(`Subject "${subject}" already exists for this user`);
  }

  const subjectDoc = await SubjectProgress.create({
    user: req.user._id,
    subject,
    topics: topics || [],
  });

  res.status(201).json(subjectDoc);
};

// PUT /api/subjects/:id/topics  — Add a topic OR update an existing topic
const upsertTopic = async (req, res) => {
  const subjectDoc = await SubjectProgress.findOne({ _id: req.params.id, user: req.user._id });
  if (!subjectDoc) {
    res.status(404);
    throw new Error("Subject not found");
  }

  const { topicId, name, status, confidence, notes, nextRevision } = req.body;

  if (topicId) {
    // UPDATE existing topic (find by its _id inside the array)
    const topic = subjectDoc.topics.id(topicId);
    if (!topic) {
      res.status(404);
      throw new Error("Topic not found");
    }
    if (name !== undefined) topic.name = name;
    if (status !== undefined) topic.status = status;
    if (confidence !== undefined) topic.confidence = confidence;
    if (notes !== undefined) topic.notes = notes;
    if (nextRevision !== undefined) topic.nextRevision = nextRevision;

    // Log if newly completed
    if (status === "completed") {
      await ActivityLog.create({
        user: req.user._id,
        type: "subjectCompleted",
        description: `Completed: ${topic.name} in ${subjectDoc.subject}`,
      });
    }
  } else {
    // ADD new topic
    subjectDoc.topics.push({ name, status, confidence, notes, nextRevision });
  }

  const updated = await subjectDoc.save();
  res.json(updated);
};

// DELETE /api/subjects/:id/topics/:topicId
const deleteTopic = async (req, res) => {
  const subjectDoc = await SubjectProgress.findOne({ _id: req.params.id, user: req.user._id });
  if (!subjectDoc) {
    res.status(404);
    throw new Error("Subject not found");
  }

  subjectDoc.topics = subjectDoc.topics.filter(
    (t) => t._id.toString() !== req.params.topicId
  );

  await subjectDoc.save();
  res.json({ message: "Topic deleted" });
};

module.exports = { getSubjects, createSubject, upsertTopic, deleteTopic };
