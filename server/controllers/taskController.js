const asyncHandler = require("../middleware/asyncHandler");
const Task = require("../models/Task");

// @desc    Get tasks for a user, optionally filtered by date and/or isRevision
// @route   GET /api/tasks?date=YYYY-MM-DD&isRevision=true|false
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { date, isRevision } = req.query;
  let query = { user: req.user._id };

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    query.date = { $gte: startOfDay, $lte: endOfDay };
  }

  if (isRevision === 'true') query.isRevision = true;
  else if (isRevision === 'false') query.isRevision = false;

  const sortOptions = isRevision === 'true' 
    ? { date: 1, createdAt: -1 } // Revisions: Soonest due first
    : { status: -1, priority: -1, createdAt: 1 }; // Planner: Pending high-priority first

  const tasks = await Task.find(query).sort(sortOptions);
  res.status(200).json(tasks);
});

// @desc    Create new task (planner task or custom revision)
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const {
    title, description, category, date, priority,
    timeBlock, exactTime, effort,
    shouldGenerateRevision, relatedSubject, relatedTopic,
    isRevision, sourceType, stageName, carriedForwardFrom,
    needsMoreFocus
  } = req.body;

  if (!title || !date) {
    res.status(400);
    throw new Error("Please provide title and target date");
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description: description || '',
    category: category || 'Custom',
    priority: priority || 'Medium',
    timeBlock: timeBlock || 'Anytime',
    exactTime: exactTime || '',
    effort: effort || 'Medium',
    shouldGenerateRevision: shouldGenerateRevision || false,
    relatedSubject: relatedSubject || '',
    relatedTopic: relatedTopic || '',
    date: new Date(date),
    isRevision: isRevision || false,
    sourceType: sourceType || (isRevision ? 'custom' : 'auto'),
    stageName: stageName || '',
    carriedForwardFrom: carriedForwardFrom || null,
    needsMoreFocus: needsMoreFocus || false,
  });

  res.status(201).json(task);
});

// @desc    Update task fields and handle auto-revision generation on completion
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to update this task");
  }

  const {
    status, title, description, category, date, priority,
    timeBlock, exactTime, effort,
    shouldGenerateRevision, relatedSubject, relatedTopic,
    confidence, needsMoreFocus, reflectionNote, snoozeCount
  } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (category !== undefined) task.category = category;
  if (date !== undefined) task.date = new Date(date);
  if (priority !== undefined) task.priority = priority;
  if (timeBlock !== undefined) task.timeBlock = timeBlock;
  if (exactTime !== undefined) task.exactTime = exactTime;
  if (effort !== undefined) task.effort = effort;
  if (shouldGenerateRevision !== undefined) task.shouldGenerateRevision = shouldGenerateRevision;
  if (relatedSubject !== undefined) task.relatedSubject = relatedSubject;
  if (relatedTopic !== undefined) task.relatedTopic = relatedTopic;
  if (confidence !== undefined) task.confidence = confidence;
  if (needsMoreFocus !== undefined) task.needsMoreFocus = needsMoreFocus;
  if (reflectionNote !== undefined) task.reflectionNote = reflectionNote;
  if (snoozeCount !== undefined) task.snoozeCount = snoozeCount;

  // Handle status change + completion logic
  if (status && status !== task.status) {
    task.status = status;
    task.completedAt = status === 'completed' ? new Date() : null;

    // Auto-generate spaced revision stages when a planner task is completed
    if (status === 'completed' && task.shouldGenerateRevision && !task.isRevision) {
      const stages = [
        { name: 'Fresh Recall', days: 2 },
        { name: 'Strengthen', days: 7 },
        { name: 'Mastery', days: 15 },
      ];

      const revisions = stages.map((stage, idx) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + stage.days);
        return {
          user: req.user._id,
          title: `Revise: ${task.title}`,
          description: task.description ? `(From: ${task.description})` : '',
          category: task.category,
          relatedSubject: task.relatedSubject,
          relatedTopic: task.relatedTopic,
          priority: 'High',
          date: dueDate,
          status: 'pending',
          isRevision: true,
          sourceType: 'auto',
          sourceTaskId: task._id,
          revisionStage: idx + 1,
          stageName: stage.name,
        };
      });

      await Task.insertMany(revisions);
      console.log(`[Spaced Repetition] Created ${revisions.length} modules for task: ${task.title}`);
      task.shouldGenerateRevision = false; // prevent re-generation
    }
  }

  const updated = await task.save();
  res.status(200).json(updated);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to delete this task");
  }

  await task.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
