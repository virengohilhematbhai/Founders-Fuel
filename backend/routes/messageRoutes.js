const express = require("express");
const { sendMessage, allMessages, deleteMessage, deleteMultipleMessages, clearChatMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.route("/").post(protect, upload.single("file"), sendMessage);
router.route("/:chatId").get(protect, allMessages);
router.route("/delete/:messageId").delete(protect, deleteMessage);
router.route("/delete-multiple").post(protect, deleteMultipleMessages);
router.route("/clear/:chatId").delete(protect, clearChatMessages);

module.exports = router;
