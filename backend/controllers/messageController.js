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

module.exports = { sendMessage, allMessages };
