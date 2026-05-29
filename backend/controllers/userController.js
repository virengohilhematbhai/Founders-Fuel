const User = require("../models/User");
const Job = require("../models/Job");
const Project = require("../models/Project");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Feedback = require("../models/Feedback");

// @desc    Get user public profile
// @route   GET /api/users/:userId
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Select only professional/public fields. Exclude password, sensitive emails/phones if necessary.
    // For now, we'll exclude password.
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { fullName, phone, skills, companyName, website, companyAddress, location } = req.body;

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (skills) user.skills = skills;
    if (companyName) user.companyName = companyName;
    if (website) user.website = website;
    if (companyAddress) user.companyAddress = companyAddress;
    if (location) {
      user.location = {
        lat: location.lat,
        lng: location.lng
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        userType: updatedUser.userType,
        companyName: updatedUser.companyName,
        phone: updatedUser.phone,
        skills: updatedUser.skills,
        website: updatedUser.website,
        companyAddress: updatedUser.companyAddress,
        location: updatedUser.location,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and ALL related data (Jobs, Projects, Chats, Messages, Feedbacks)
// @route   DELETE /api/users/profile
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

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
    // Find chats where this user was a participant
    const userChats = await Chat.find({ users: { $in: [userId] } });
    const chatIds = userChats.map(chat => chat._id);
    
    // Delete all messages belonging to these chats
    await Message.deleteMany({ chat: { $in: chatIds } });
    
    // Delete all messages sent by this user (even if chat remains, e.g. group chat)
    await Message.deleteMany({ sender: userId });
    
    // Delete the chats themselves
    await Chat.deleteMany({ _id: { $in: chatIds } });

    // 4. Delete Reputation Data (Feedbacks)
    await Feedback.deleteMany({
      $or: [{ reviewer: userId }, { reviewee: userId }]
    });

    // 5. Delete the User record
    await user.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: "Your account and all associated data (jobs, messages, and reviews) have been permanently removed." 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile, deleteAccount };
