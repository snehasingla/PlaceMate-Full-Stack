const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    // Planner nudge types
    enum: [
      "plan_today",        // No tasks planned for today
      "planner_reminder",  // Has tasks but none complete yet
      "celebration",       // All tasks for today completed
      "overdue_tasks",     // Pending tasks from yesterday or earlier
      "revision_due",      // Revision(s) due today
      "revision_overdue",  // Revision(s) overdue
      "streak_nudge",      // Motivational - keep going
      "weak_area_focus",   // Has needsMoreFocus revisions
    ],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String, default: "" }, // frontend route to navigate to
}, { timestamps: true });

// Auto-expire notifications older than 7 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model("Notification", notificationSchema);
