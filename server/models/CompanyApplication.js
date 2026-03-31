// models/CompanyApplication.js

const mongoose = require("mongoose");

const companyApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    applicationDate: { type: Date },
    status: {
      type: String,
      enum: ["wishlist", "applied", "oaScheduled", "interviewScheduled", "rejected", "selected"],
      default: "wishlist",
    },
    jdLink: { type: String, default: "" },
    notes: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    deadline: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompanyApplication", companyApplicationSchema);
