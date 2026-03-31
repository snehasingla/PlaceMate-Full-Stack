// controllers/analyticsController.js
// Returns aggregated stats for dashboard and analytics page

const DSAProblem = require("../models/DSAProblem");
const SubjectProgress = require("../models/SubjectProgress");
const CompanyApplication = require("../models/CompanyApplication");
const ActivityLog = require("../models/ActivityLog");
const MockSession = require("../models/MockSession");
const Note = require("../models/Note");

// GET /api/analytics/dashboard
// Returns all data needed to render the main dashboard
const getDashboardStats = async (req, res) => {
  const userId = req.user._id;

  // Run all queries in parallel for performance
  const [
    totalProblems,
    solvedProblems,
    totalCompanies,
    recentActivity,
    subjects,
    pendingRevisions,
    totalNotes,
  ] = await Promise.all([
    DSAProblem.countDocuments({ user: userId }),
    DSAProblem.countDocuments({ user: userId, status: "solved" }),
    CompanyApplication.countDocuments({ user: userId }),
    ActivityLog.find({ user: userId }).sort({ createdAt: -1 }).limit(8),
    SubjectProgress.find({ user: userId }),
    DSAProblem.countDocuments({ user: userId, status: "reviseLater" }),
    Note.countDocuments({ user: userId }),
  ]);

  // Calculate overall subject completion %
  let totalTopics = 0;
  let completedTopics = 0;
  subjects.forEach((s) => {
    totalTopics += s.topics.length;
    completedTopics += s.topics.filter((t) => t.status === "completed").length;
  });
  const subjectProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Average mock session score from self ratings
  const mockSessions = await MockSession.find({ user: userId, completedAt: { $exists: true } });
  let mockScore = "0/5";
  if (mockSessions.length > 0) {
    const allRatings = mockSessions.flatMap((session) => session.answers.map((answer) => answer.selfRating || 0));
    const averageRating = allRatings.length > 0 ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length : 0;
    mockScore = `${(Math.round(averageRating * 10) / 10).toFixed(1)}/5`;
  }

  res.json({
    dsa: {
      total: totalProblems,
      solved: solvedProblems,
      reviseLater: pendingRevisions,
    },
    companies: { total: totalCompanies },
    notes: { total: totalNotes },
    subjectProgress,
    recentActivity,
    streak: {
      current: req.user.streak?.current || 0,
      longest: req.user.streak?.longest || 0,
    },
    mockScore,
  });
};

// GET /api/analytics/dsa
// Topic-wise breakdown of DSA problems
const getDSAAnalytics = async (req, res) => {
  const userId = req.user._id;

  // MongoDB aggregation: group by topic and status
  const topicStats = await DSAProblem.aggregate([
    { $match: { user: userId } },
    { $group: { _id: { topic: "$topic", status: "$status" }, count: { $sum: 1 } } },
  ]);

  // Also get difficulty distribution
  const difficultyStats = await DSAProblem.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$difficulty", count: { $sum: 1 } } },
  ]);

  res.json({ topicStats, difficultyStats });
};

// GET /api/analytics/subjects
const getSubjectAnalytics = async (req, res) => {
  const subjects = await SubjectProgress.find({ user: req.user._id });

  const result = subjects.map((s) => {
    const total = s.topics.length;
    const completed = s.topics.filter((t) => t.status === "completed").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { subject: s.subject, total, completed, percentage };
  });

  res.json(result);
};

// GET /api/analytics/companies
const getCompanyAnalytics = async (req, res) => {
  const pipeline = await CompanyApplication.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.json(pipeline);
};

// GET /api/analytics/activity
// Last 7 days activity data (problems solved per day)
const getActivityAnalytics = async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const activity = await ActivityLog.aggregate([
    { $match: { user: req.user._id, createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(activity);
};

module.exports = {
  getDashboardStats,
  getDSAAnalytics,
  getSubjectAnalytics,
  getCompanyAnalytics,
  getActivityAnalytics,
};
