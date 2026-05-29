const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Job");
const Project = require("../models/Project");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Feedback = require("../models/Feedback");
const { protect } = require("../middleware/authMiddleware");

// Middleware: admin only (userType === "admin")
const adminOnly = (req, res, next) => {
  if (req.user && req.user.userType === "admin") {
    return next();
  }
  res.status(403).json({ success: false, message: "Access denied: Admins only" });
};

// GET /api/admin/users - all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/admin/jobs - all jobs with populated applicants
router.get("/jobs", protect, adminOnly, async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate("postedBy", "fullName companyName email website")
      .populate("applicants", "fullName email phone skills")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /api/admin/users/:id - delete user completely
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete related data
    const userId = user._id;

    // 1. Delete Jobs and Applications
    if (user.userType === "startup") {
      await Job.deleteMany({ postedBy: userId });
    } else if (user.userType === "fresher") {
      await Job.updateMany(
        { applicants: userId },
        { $pull: { applicants: userId } }
      );
    }

    // 2. Delete Projects
    await Project.deleteMany({ submittedBy: userId });

    // 3. Delete Conversations (Messages and Chats)
    const userChats = await Chat.find({ users: { $in: [userId] } });
    const chatIds = userChats.map(chat => chat._id);
    
    await Message.deleteMany({ chat: { $in: chatIds } });
    await Message.deleteMany({ sender: userId });
    await Chat.deleteMany({ _id: { $in: chatIds } });

    // 4. Delete Reputation Data (Feedbacks)
    await Feedback.deleteMany({
      $or: [{ reviewer: userId }, { reviewee: userId }]
    });

    // 5. Delete the User record
    await user.deleteOne();

    res.json({ success: true, message: "User account and all related data (jobs, projects, chats, and reviews) have been permanently deleted" });
  } catch (err) {
    console.error("Admin delete error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PATCH /api/admin/users/:id/blacklist - Toggle user's blacklist status
router.patch("/users/:id/blacklist", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.userType === "admin") {
      return res.status(403).json({ success: false, message: "Admins cannot be blacklisted" });
    }

    user.isBlacklisted = !user.isBlacklisted;
    await user.save();

    res.json({
      success: true,
      message: `User has been successfully ${user.isBlacklisted ? "blacklisted" : "unblocked"}`,
      user: {
        id: user._id,
        fullName: user.fullName,
        isBlacklisted: user.isBlacklisted,
      },
    });
  } catch (err) {
    console.error("Blacklist toggle error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;