const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    if (req.user.isBlacklisted) {
      return res.status(403).json({ success: false, message: "Your account is blacklisted. Access denied." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

// Only allow startups
const startupOnly = (req, res, next) => {
  if (req.user && req.user.userType === "startup") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied: Startups only" });
  }
};

// Only allow freshers
const fresherOnly = (req, res, next) => {
  if (req.user && req.user.userType === "fresher") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied: Freshers only" });
  }
};

module.exports = { protect, startupOnly, fresherOnly };