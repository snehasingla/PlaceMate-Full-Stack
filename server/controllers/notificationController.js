const asyncHandler = require("../middleware/asyncHandler");
const Notification = require("../models/Notification");
const Task = require("../models/Task");
const { generateNotifications } = require("../utils/notificationEngine");

// ── Helper: get today's date range ──────────────────────────
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @desc  Get notifications for the current user
//        Auto-generates fresh ones if none exist for today
// @route GET /api/notifications
// @access Private
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { start, end } = getTodayRange();

  // Check if we already generated notifications for today
  const existingToday = await Notification.find({
    user: userId,
    createdAt: { $gte: start, $lte: end },
  }).sort({ createdAt: -1 });

  // If already generated today, return them
  if (existingToday.length > 0) {
    const all = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.status(200).json(all);
  }

  // ── Gather data for rule engine ──────────────────────────
  const todayTasks = await Task.find({
    user: userId,
    isRevision: false,
    date: { $gte: start, $lte: end },
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const overdueRevisions = await Task.find({
    user: userId,
    isRevision: true,
    status: "pending",
    date: { $lt: start },
  });

  const dueRevisions = await Task.find({
    user: userId,
    isRevision: true,
    status: "pending",
    date: { $gte: start, $lte: end },
  });

  const focusRevisions = await Task.find({
    user: userId,
    isRevision: true,
    status: "pending",
    needsMoreFocus: true,
  });

  // ── Run rule engine ──────────────────────────────────────
  const pendingToday = todayTasks.filter((t) => t.status === "pending");
  const completedToday = todayTasks.filter((t) => t.status === "completed");

  const generated = generateNotifications({
    todayTasks,
    pendingToday,
    completedToday,
    overdueRevisions,
    dueRevisions,
    focusRevisions,
  });

  // ── Persist generated notifications ─────────────────────
  if (generated.length > 0) {
    const docs = generated.map((n) => ({ ...n, user: userId }));
    await Notification.insertMany(docs);
  }

  // Return all notifications for this user (recent 50)
  const all = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json(all);
});

// @desc  Mark one notification as read
// @route PUT /api/notifications/:id/read
// @access Private
const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  notification.read = true;
  await notification.save();
  res.status(200).json(notification);
});

// @desc  Mark all notifications as read
// @route PUT /api/notifications/read-all
// @access Private
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { $set: { read: true } }
  );
  res.status(200).json({ message: "All marked as read" });
});

// @desc  Delete a notification
// @route DELETE /api/notifications/:id
// @access Private
const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.status(200).json({ id: req.params.id });
});

// @desc  Force-regenerate notifications (for testing / refresh)
// @route POST /api/notifications/refresh
// @access Private
const refreshNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { start, end } = getTodayRange();

  // Delete today's notifications so they regenerate
  await Notification.deleteMany({
    user: userId,
    createdAt: { $gte: start, $lte: end },
  });

  // Re-run the logic
  const todayTasks = await Task.find({
    user: userId,
    isRevision: false,
    date: { $gte: start, $lte: end },
  });

  const overdueRevisions = await Task.find({
    user: userId,
    isRevision: true,
    status: "pending",
    date: { $lt: start },
  });

  const dueRevisions = await Task.find({
    user: userId,
    isRevision: true,
    status: "pending",
    date: { $gte: start, $lte: end },
  });

  const focusRevisions = await Task.find({
    user: userId,
    isRevision: true,
    status: "pending",
    needsMoreFocus: true,
  });

  const pendingToday = todayTasks.filter((t) => t.status === "pending");
  const completedToday = todayTasks.filter((t) => t.status === "completed");

  const generated = generateNotifications({
    todayTasks,
    pendingToday,
    completedToday,
    overdueRevisions,
    dueRevisions,
    focusRevisions,
  });

  if (generated.length > 0) {
    await Notification.insertMany(generated.map((n) => ({ ...n, user: userId })));
  }

  const all = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json(all);
});

module.exports = { getNotifications, markRead, markAllRead, deleteNotification, refreshNotifications };
