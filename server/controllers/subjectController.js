// controllers/subjectController.js

const SubjectProgress = require("../models/SubjectProgress");
const ActivityLog = require("../models/ActivityLog");

// GET /api/subjects  — Get all subject docs for this user
const getSubjects = async (req, res) => {
  const subjects = await SubjectProgress.find({ user: req.user._id });
  res.json(subjects);
};

// GET /api/subjects/progress?subject=<subjectName>
const getSubjectProgress = async (req, res) => {
  const subjectName = req.query.subject;
  if (!subjectName) {
    res.status(400);
    throw new Error("Subject name is required");
  }

  const subjectDoc = await SubjectProgress.findOne({ user: req.user._id, subject: subjectName });
  if (!subjectDoc) {
    res.status(404);
    throw new Error("Subject progress not found");
  }

  res.json(subjectDoc);
};

// POST /api/subjects  — Create a new subject doc (e.g. initialize "OS" for a user)
const createSubject = async (req, res) => {
  const { subject, topics } = req.body;

  const existing = await SubjectProgress.findOne({ user: req.user._id, subject });
  if (existing) {
    res.status(400);
    throw new Error(`Subject "${subject}" already exists for this user`);
  }

  const normalizedTopics = Array.isArray(topics)
    ? topics.map((topic) => ({
        topicId: topic.topicId,
        name: topic.name || topic.title || "Untitled Topic",
        status: "notStarted",
        confidence: topic.confidence || "low",
        notes: topic.notes || "",
        nextRevision: topic.nextRevision || null,
        completedSubtopics: topic.completedSubtopics || [],
      }))
    : [];

  const subjectDoc = await SubjectProgress.create({
    user: req.user._id,
    subject,
    topics: normalizedTopics,
    resources: [],
    trackingEnabled: false,
  });

  res.status(201).json(subjectDoc);
};

// PUT /api/subjects/:id/topics  — Update completed subtopics or other topic details
const upsertTopic = async (req, res) => {
  const subjectDoc = await SubjectProgress.findOne({ _id: req.params.id, user: req.user._id });
  if (!subjectDoc) {
    res.status(404);
    throw new Error("Subject not found");
  }

  const {
    topicId,
    topicIndex,
    name,
    status,
    confidence,
    notes,
    nextRevision,
    completedSubtopics,
    subtopicCount,
  } = req.body;

  let topic;
  if (topicId) {
    topic = subjectDoc.topics.find((t) => t.topicId === topicId);
    
    // Auto-repair fallback for older documents missing topicId
    if (!topic && name) {
      topic = subjectDoc.topics.find((t) => t.name === name);
      if (topic) {
        topic.topicId = topicId;
      }
    }
  } else if (topicIndex !== undefined) {
    topic = subjectDoc.topics[topicIndex];
  }

  if (!topic) {
    res.status(404);
    throw new Error("Topic not found");
  }

  const previousStatus = topic.status;

  if (name !== undefined) topic.name = name;
  if (confidence !== undefined) topic.confidence = confidence;
  if (notes !== undefined) topic.notes = notes;
  if (nextRevision !== undefined) topic.nextRevision = nextRevision;

  if (Array.isArray(completedSubtopics)) {
    topic.completedSubtopics = completedSubtopics;

    if (typeof subtopicCount === "number") {
      if (completedSubtopics.length === subtopicCount) {
        topic.status = "completed";
      } else if (completedSubtopics.length > 0) {
        topic.status = "inProgress";
      } else {
        topic.status = "notStarted";
      }
    } else {
      topic.status = completedSubtopics.length > 0 ? "inProgress" : "notStarted";
    }
  }

  if (status !== undefined) {
    topic.status = status;
  }

  if (topic.status === "completed" && previousStatus !== "completed") {
    await ActivityLog.create({
      user: req.user._id,
      type: "subjectCompleted",
      description: `Completed: ${topic.name} in ${subjectDoc.subject}`,
    });
  }

  const updated = await subjectDoc.save();
  res.json(updated);
};

// PUT /api/subjects/:id/resources  — Replace custom resources for a subject
const updateResources = async (req, res) => {
  const subjectDoc = await SubjectProgress.findOne({ _id: req.params.id, user: req.user._id });
  if (!subjectDoc) {
    res.status(404);
    throw new Error("Subject not found");
  }

  const { resources } = req.body;
  if (!Array.isArray(resources)) {
    res.status(400);
    throw new Error("Resources must be an array");
  }

  subjectDoc.resources = resources;
  const updated = await subjectDoc.save();
  res.json(updated);
};

// PUT /api/subjects/:id/tracking  — Enable or disable tracking for a subject
const updateTracking = async (req, res) => {
  const subjectDoc = await SubjectProgress.findOne({ _id: req.params.id, user: req.user._id });
  if (!subjectDoc) {
    res.status(404);
    throw new Error("Subject not found");
  }

  const { trackingEnabled } = req.body;
  if (typeof trackingEnabled !== "boolean") {
    res.status(400);
    throw new Error("trackingEnabled must be a boolean");
  }

  subjectDoc.trackingEnabled = trackingEnabled;
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

module.exports = { getSubjects, getSubjectProgress, createSubject, upsertTopic, updateResources, updateTracking, deleteTopic };
