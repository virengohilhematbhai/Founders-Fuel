const express = require("express");
const router = express.Router();
const { submitContact, getAllMessages } = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", submitContact);
router.get("/", protect, getAllMessages); // Protected: only logged-in users can view

module.exports = router;