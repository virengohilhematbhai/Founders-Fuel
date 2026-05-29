const express = require("express");
const router = express.Router();
const { submitFeedback, getUserFeedback, getGivenFeedback } = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, submitFeedback);
router.get("/:userId", getUserFeedback);
router.get("/given/:userId", protect, getGivenFeedback);

module.exports = router;
