// controllers/companyController.js

const CompanyApplication = require("../models/CompanyApplication");
const ActivityLog = require("../models/ActivityLog");

// GET /api/companies
const getApplications = async (req, res) => {
  const { status, priority } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const apps = await CompanyApplication.find(filter).sort({ createdAt: -1 });
  res.json(apps);
};

// POST /api/companies
const addApplication = async (req, res) => {
  const { companyName, role, applicationDate, status, jdLink, notes, priority, deadline } = req.body;

  const app = await CompanyApplication.create({
    user: req.user._id,
    companyName, role, applicationDate, status, jdLink, notes, priority, deadline,
  });

  await ActivityLog.create({
    user: req.user._id,
    type: "appAdded",
    description: `Added ${companyName} – ${role}`,
  });

  res.status(201).json(app);
};

// PUT /api/companies/:id
const updateApplication = async (req, res) => {
  const app = await CompanyApplication.findOne({ _id: req.params.id, user: req.user._id });
  if (!app) {
    res.status(404);
    throw new Error("Application not found");
  }
  Object.assign(app, req.body);
  const updated = await app.save();
  res.json(updated);
};

// DELETE /api/companies/:id
const deleteApplication = async (req, res) => {
  const app = await CompanyApplication.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!app) {
    res.status(404);
    throw new Error("Application not found");
  }
  res.json({ message: "Application deleted" });
};

module.exports = { getApplications, addApplication, updateApplication, deleteApplication };
