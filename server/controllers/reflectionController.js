const asyncHandler = require("../middleware/asyncHandler");
const DailyReflection = require("../models/DailyReflection");

// @desc  Get reflection for a specific date
// @route GET /api/reflections?date=YYYY-MM-DD
// @access Private
const getReflection = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) {
    res.status(400);
    throw new Error("Date query param is required");
  }
  const reflection = await DailyReflection.findOne({ user: req.user._id, date });
  res.status(200).json(reflection || null);
});

// @desc  Upsert (create or update) reflection for a given date
// @route POST /api/reflections
// @access Private
const saveReflection = asyncHandler(async (req, res) => {
  const { date, wentWell, skipped, focusTomorrow } = req.body;
  if (!date) {
    res.status(400);
    throw new Error("Date is required");
  }

  const reflection = await DailyReflection.findOneAndUpdate(
    { user: req.user._id, date },
    { wentWell: wentWell || "", skipped: skipped || "", focusTomorrow: focusTomorrow || "" },
    { upsert: true, new: true }
  );

  res.status(200).json(reflection);
});

module.exports = { getReflection, saveReflection };
