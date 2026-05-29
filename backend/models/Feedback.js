const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userType: {
      type: String,
      enum: ["fresher", "startup"],
      required: true, // Type of the user BEING reviewed
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    criteria: {
      // For Freshers (reviewed by Startup)
      performance: { type: Number, min: 0, max: 5 },
      skills: { type: Number, min: 0, max: 5 },
      professionalism: { type: Number, min: 0, max: 5 },
      
      // For Startups (reviewed by Fresher)
      workExperience: { type: Number, min: 0, max: 5 },
      environment: { type: Number, min: 0, max: 5 },
      support: { type: Number, min: 0, max: 5 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
