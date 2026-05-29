const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { fullName, email, password, userType, phone, skills, companyName, website } = req.body;

    if (!fullName || !email || !password || !userType) {
      return res.status(400).json({ success: false, message: "fullName, email, password and userType are required" });
    }
    if (!["fresher", "startup", "admin"].includes(userType)) {
      return res.status(400).json({ success: false, message: "userType must be fresher, startup, or admin" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    if (userType === "fresher" && !phone) {
      return res.status(400).json({ success: false, message: "Phone number is required for freshers" });
    }
    if (userType === "startup" && !companyName) {
      return res.status(400).json({ success: false, message: "Company name is required for startups" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const userData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      userType,
    };
    if (userType === "fresher") {
      userData.phone = phone.trim();
      if (skills) userData.skills = skills.trim();
    } else {
      userData.companyName = companyName.trim();
      if (website) userData.website = website.trim();
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        companyName: user.companyName || null,
        phone: user.phone || null,
        skills: user.skills || null,
        website: user.website || null,
      },
    });
  } catch (error) {
    console.error("Register error:", error.name, "-", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    return res.status(500).json({ success: false, message: "Server error during registration. Please try again." });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.isBlacklisted) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blacklisted. Please contact administrator for support.",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        companyName: user.companyName || null,
        phone: user.phone || null,
        skills: user.skills || null,
        website: user.website || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error.name, "-", error.message);
    return res.status(500).json({ success: false, message: "Server error during login. Please try again." });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { register, login, getMe };