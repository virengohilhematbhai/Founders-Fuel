const Contact = require("../models/Contact");

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const contact = await Contact.create({ name, email, subject, message });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent! We'll get back to you within 24 hours.",
      contact,
    });
  } catch (error) {
    console.error("Contact error:", error);
    return res.status(500).json({ success: false, message: "Failed to send message. Please try again." });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { submitContact, getAllMessages };