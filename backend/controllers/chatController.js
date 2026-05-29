const Chat = require("../models/Chat");
const User = require("../models/User");
const Job = require("../models/Job");

// @desc    Create or fetch One to One Chat
// @route   POST /api/chat
// @access  Protected
const accessChat = async (req, res) => {
  const { userId, jobId } = req.body;

  if (!userId || !jobId) {
    console.log("UserId or JobId param not sent with request");
    return res.status(400).json({ success: false, message: "UserId and JobId are required" });
  }

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      job: jobId,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("job", "title company")
      .populate("latestMessage");

    // Populate sender info in latest message
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "fullName email",
    });

    if (isChat.length > 0) {
      res.json(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
        job: jobId,
      };

      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password")
        .populate("job", "title company");
      res.status(200).json(FullChat);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Fetch all chats for a user
// @route   GET /api/chat
// @access  Protected
const fetchChats = async (req, res) => {
  try {
    let results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("job", "title company")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "fullName email",
    });

    // --- Cleanup logic for orphaned chats (deleted users) ---
    // Extract chats where any user in the 'users' array is null
    const orphanedChatIds = results
      .filter(chat => chat.users.some(u => u === null))
      .map(chat => chat._id);

    if (orphanedChatIds.length > 0) {
      const Message = require("../models/Message"); // Ensure Message model is available for cleanup
      await Chat.deleteMany({ _id: { $in: orphanedChatIds } });
      await Message.deleteMany({ chat: { $in: orphanedChatIds } });
      // Filter out from current results to hide immediately
      results = results.filter(chat => !orphanedChatIds.includes(chat._id));
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { accessChat, fetchChats };
