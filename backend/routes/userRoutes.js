const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteAccount } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:userId", getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteAccount);

module.exports = router;
