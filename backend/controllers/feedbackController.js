const Feedback = require("../models/Feedback");
const User = require("../models/User");

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
const submitFeedback = async (req, res, next) => {
  try {
    const { revieweeId, rating, comment, criteria } = req.body;
    const reviewerId = req.user._id;

    if (revieweeId.toString() === reviewerId.toString()) {
      return res.status(400).json({ success: false, message: "You cannot review yourself" });
    }

    const reviewee = await User.findById(revieweeId);
    if (!reviewee) {
      return res.status(404).json({ success: false, message: "User being reviewed not found" });
    }

    const feedback = await Feedback.create({
      reviewer: reviewerId,
      reviewee: revieweeId,
      userType: reviewee.userType,
      rating,
      comment,
      criteria,
    });

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback received by a user
// @route   GET /api/feedback/:userId
// @access  Public
const getUserFeedback = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const feedbacks = await Feedback.find({ reviewee: userId })
      .populate("reviewer", "fullName companyName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: feedbacks.length, feedbacks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback given by a user
// @route   GET /api/feedback/given/:userId
// @access  Private
const getGivenFeedback = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const feedbacks = await Feedback.find({ reviewer: userId })
      .populate("reviewee", "fullName companyName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: feedbacks.length, feedbacks });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitFeedback, getUserFeedback, getGivenFeedback };
