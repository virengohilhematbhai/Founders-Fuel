const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteAccount } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteAccount);
router.get("/:userId", getUserProfile);

module.exports = router;

