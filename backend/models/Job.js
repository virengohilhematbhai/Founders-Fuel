const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    tags: [{ type: String, trim: true }],
    duration: { type: String, trim: true },
    stipend:  { type: String, trim: true },
    stipendAmount: { type: Number, default: 0 },
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    type: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      default: "remote",
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);