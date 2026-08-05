const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

// @desc    Send a Message
// @route   POST /api/message
// @access  Protected
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  const file = req.file;

  if (!chatId || (!content && !file)) {
    console.log("Invalid data passed into request");
    return res.status(400).json({ success: false, message: "Invalid data passed into request" });
  }

  var newMessage = {
    sender: req.user._id,
    content: content || "",
    chat: chatId,
  };

  if (file) {
    newMessage.fileUrl = file.filename;
    newMessage.fileType = file.mimetype;
    newMessage.fileOriginalName = file.originalname;
    newMessage.fileSize = file.size;
  }

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "fullName email companyName userType");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "fullName email userType companyName",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all Messages
// @route   GET /api/message/:chatId
// @access  Protected
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "fullName email companyName userType")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a Message
// @route   DELETE /api/message/:messageId
// @access  Protected
const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId).populate("chat");
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this message" });
    }

    const chatId = message.chat._id;
    await Message.deleteOne({ _id: messageId });

    const chat = await Chat.findById(chatId);
    if (chat && chat.latestMessage && chat.latestMessage.toString() === messageId) {
      const latest = await Message.find({ chat: chatId }).sort({ createdAt: -1 }).limit(1);
      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: latest.length > 0 ? latest[0]._id : null,
      });
    }

    res.json({ success: true, message: "Message deleted successfully", messageId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete multiple messages
// @route   POST /api/message/delete-multiple
// @access  Protected
const deleteMultipleMessages = async (req, res) => {
  const { messageIds } = req.body;

  if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
    return res.status(400).json({ success: false, message: "No message IDs provided" });
  }

  try {
    const messagesToDelete = await Message.find({
      _id: { $in: messageIds }
    }).populate("chat");

    const validMessageIds = [];
    let chatId = null;

    for (const msg of messagesToDelete) {
      if (msg.chat && msg.chat.users.some(u => u.toString() === req.user._id.toString())) {
        validMessageIds.push(msg._id);
        if (!chatId) chatId = msg.chat._id;
      }
    }

    if (validMessageIds.length === 0) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete these messages" });
    }

    await Message.deleteMany({ _id: { $in: validMessageIds } });

    if (chatId) {
      const chat = await Chat.findById(chatId);
      if (chat && chat.latestMessage && validMessageIds.some(id => id.toString() === chat.latestMessage.toString())) {
        const remainingMessages = await Message.find({ chat: chatId })
          .sort({ createdAt: -1 })
          .limit(1);
        await Chat.findByIdAndUpdate(chatId, {
          latestMessage: remainingMessages.length > 0 ? remainingMessages[0]._id : null,
        });
      }
    }

    res.json({ success: true, message: "Selected messages deleted successfully", deletedIds: validMessageIds });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Clear all messages in a chat
// @route   DELETE /api/message/clear/:chatId
// @access  Protected
const clearChatMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found or access denied" });
    }

    await Message.deleteMany({ chat: chatId });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: null });

    res.json({ success: true, message: "All messages cleared successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, allMessages, deleteMessage, deleteMultipleMessages, clearChatMessages };
