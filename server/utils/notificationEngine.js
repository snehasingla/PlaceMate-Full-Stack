// ─────────────────────────────────────────────────────────────
//  Notification Engine
//  Rule-based message pools + selection logic
//  Returns { type, title, message, link } objects
// ─────────────────────────────────────────────────────────────

// Message pools per notification type
const POOLS = {
  plan_today: [
    {
      title: "Your day is a blank canvas 🎨",
      message: "No tasks planned yet. Head to the planner and build out your preparation schedule for today.",
    },
    {
      title: "Don't let today slip away ⏳",
      message: "You haven't added any tasks for today. A simple 3-task plan is all you need to stay consistent.",
    },
    {
      title: "Consistency is your superpower 💪",
      message: "No plan = no progress. Open the Daily Planner and set your goals for today.",
    },
  ],

  planner_reminder: [
    {
      title: "Tasks waiting for you 📋",
      message: "You have tasks planned for today — none completed yet. Time to chip away at it!",
    },
    {
      title: "Morning check-in 🌅",
      message: "Your planner has tasks ready. Start with the highest priority one to build momentum.",
    },
    {
      title: "Stay on track 🎯",
      message: "You've planned your day — now execute it. Open the planner to get started.",
    },
  ],

  celebration: [
    {
      title: "Perfect day! 🎉",
      message: "You crushed every task today. Your consistency is building something great. Keep the streak going!",
    },
    {
      title: "100% complete! 🏆",
      message: "All tasks done for today. That discipline is exactly what separates strong candidates. Well done!",
    },
    {
      title: "Legendary session 🔥",
      message: "Every single task completed. That's the kind of focus that wins interviews. Rest well tonight!",
    },
  ],

  overdue_tasks: [
    {
      title: "Don't let tasks pile up ⚠️",
      message: "You have unfinished tasks from a previous day. Use 'Carry Forward' to reschedule them now.",
    },
    {
      title: "Overdue tasks detected 🔔",
      message: "Some planner tasks from earlier are still pending. Carry them forward or mark them done.",
    },
  ],

  revision_due: [
    {
      title: "Revision sessions due today 🔁",
      message: "You have revisions scheduled for today. Complete them to reinforce your memory at peak retention.",
    },
    {
      title: "Don't skip your revisions 📖",
      message: "Spaced repetition only works if you do it on time. Your revision sessions are waiting.",
    },
    {
      title: "Memory check time ⚡",
      message: "Today's revision sessions are ready. Each session is your brain's chance to lock in the knowledge.",
    },
  ],

  revision_overdue: [
    {
      title: "Overdue revisions need attention ❗",
      message: "Some revision sessions are past their due date. Delaying further reduces retention effectiveness.",
    },
    {
      title: "Your spaced repetition is slipping 📉",
      message: "Overdue revisions in your planner. Head to the Revision Planner to catch up — it's not too late.",
    },
  ],

  streak_nudge: [
    {
      title: "Keep the momentum going 🚀",
      message: "Great preparation is built one consistent day at a time. You're doing the work — don't stop now.",
    },
    {
      title: "Interviews reward consistent prep 🎓",
      message: "Every day you show up is a day your competition might not. Stay consistent.",
    },
    {
      title: "Build the habit, build the skill 🧠",
      message: "The best candidates aren't smarter — they're more consistent. Keep your streak alive.",
    },
  ],

  weak_area_focus: [
    {
      title: "Weak areas need your attention 🎯",
      message: "You've flagged topics that need more focus. Head to the 'Need More Focus' tab in Revision Planner.",
    },
    {
      title: "Your weak spots are waiting 🔥",
      message: "You marked some topics as needing more work. Prioritize those today for maximum improvement.",
    },
  ],
};

// Select a message from a pool — slightly varied each call using timestamp mod
const pick = (pool) => {
  const idx = new Date().getDate() % pool.length;
  return pool[idx];
};

// ─────────────────────────────────────────────────────────────
//  Rule-based notification generator
//  Called with current user data snapshots
// ─────────────────────────────────────────────────────────────

const generateNotifications = ({
  todayTasks,       // all tasks for today (non-revision)
  pendingToday,     // tasks for today that are still pending
  completedToday,   // tasks for today that are done
  overdueRevisions, // revision tasks where date < today
  dueRevisions,     // revision tasks due today
  focusRevisions,   // revision tasks with needsMoreFocus = true
}) => {
  const notifications = [];

  // 1. No plan for today
  if (todayTasks.length === 0) {
    notifications.push({ type: "plan_today", link: "/planner", ...pick(POOLS.plan_today) });
  }

  // 2. Has tasks but none done
  else if (pendingToday.length === todayTasks.length && todayTasks.length > 0) {
    notifications.push({ type: "planner_reminder", link: "/planner", ...pick(POOLS.planner_reminder) });
  }

  // 3. All tasks done — celebrate
  else if (completedToday.length === todayTasks.length && todayTasks.length > 0) {
    notifications.push({ type: "celebration", link: "/planner", ...pick(POOLS.celebration) });
  }

  // 4. Overdue revisions
  if (overdueRevisions.length > 0) {
    const n = pick(POOLS.revision_overdue);
    notifications.push({
      type: "revision_overdue",
      link: "/revisions",
      title: n.title,
      message: `${n.message} (${overdueRevisions.length} overdue)`,
    });
  }

  // 5. Due today revisions
  if (dueRevisions.length > 0) {
    const n = pick(POOLS.revision_due);
    notifications.push({
      type: "revision_due",
      link: "/revisions",
      title: n.title,
      message: `${n.message} (${dueRevisions.length} due today)`,
    });
  }

  // 6. Weak area focus
  if (focusRevisions.length > 0) {
    notifications.push({
      type: "weak_area_focus",
      link: "/revisions",
      ...pick(POOLS.weak_area_focus),
    });
  }

  // 7. Occasional streak nudge (when user has done at least one thing)
  if (completedToday.length > 0 && completedToday.length < todayTasks.length) {
    notifications.push({ type: "streak_nudge", link: "/planner", ...pick(POOLS.streak_nudge) });
  }

  return notifications;
};

module.exports = { generateNotifications, POOLS };
