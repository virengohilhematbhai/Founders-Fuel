/**
 * FoundersFuel — DEBUG SERVER
 * 
 * This is a TEMPORARY single-file server for debugging the 500 error.
 * It has ALL logic inline so nothing can fail silently.
 * 
 * HOW TO USE:
 *   1. Copy this file into your backend/ folder
 *   2. Run: node debug-server.js
 *   3. Try to register at localhost:5173
 *   4. The EXACT error will appear in your terminal AND in the browser console
 */

// ── 1. Load packages one by one so we know which one fails ────
console.log("\n🔍 Loading packages...");

let express, cors, dotenv, mongoose, bcrypt, jwt;

try { express = require("express"); console.log("  ✅ express:", require("./node_modules/express/package.json").version); }
catch(e) { console.error("  ❌ express FAILED:", e.message); process.exit(1); }

try { cors = require("cors"); console.log("  ✅ cors loaded"); }
catch(e) { console.error("  ❌ cors FAILED:", e.message); process.exit(1); }

try { dotenv = require("dotenv"); dotenv.config(); console.log("  ✅ dotenv loaded"); }
catch(e) { console.error("  ❌ dotenv FAILED:", e.message); process.exit(1); }

try { mongoose = require("mongoose"); console.log("  ✅ mongoose:", require("./node_modules/mongoose/package.json").version); }
catch(e) { console.error("  ❌ mongoose FAILED:", e.message); process.exit(1); }

try { bcrypt = require("bcryptjs"); console.log("  ✅ bcryptjs:", require("./node_modules/bcryptjs/package.json").version); }
catch(e) { console.error("  ❌ bcryptjs FAILED:", e.message); process.exit(1); }

try { jwt = require("jsonwebtoken"); console.log("  ✅ jsonwebtoken loaded"); }
catch(e) { console.error("  ❌ jsonwebtoken FAILED:", e.message); process.exit(1); }

// ── 2. Test bcrypt IMMEDIATELY ─────────────────────────────────
console.log("\n🔍 Testing bcrypt...");
(async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("test", salt);
    const ok = await bcrypt.compare("test", hash);
    console.log("  ✅ bcrypt works correctly. compare result:", ok);
  } catch(e) {
    console.error("  ❌ bcrypt BROKEN:", e.message);
    console.error("  ⚠️  THIS IS YOUR 500 ERROR CAUSE");
    console.error("  Fix: rm -rf node_modules && npm install (with bcryptjs ^2.4.3 in package.json)");
  }
})();

// ── 3. MongoDB ─────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/foundersfuel";
const JWT_SECRET = process.env.JWT_SECRET || "foundersfuel_secret";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";
const PORT = process.env.PORT || 5000;

console.log("\n🔍 Connecting to MongoDB:", MONGO_URI);
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("  ✅ MongoDB connected!"))
  .catch(e => {
    console.error("  ❌ MongoDB FAILED:", e.message);
    console.error("  ⚠️  Start MongoDB locally OR update MONGO_URI in .env to use Atlas");
  });

// ── 4. User Schema (inline) ────────────────────────────────────
const userSchema = new mongoose.Schema({
  fullName:    { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true, minlength: 6, select: false },
  userType:    { type: String, enum: ["fresher", "startup"], required: true },
  phone:       { type: String, trim: true },
  skills:      { type: String, trim: true },
  companyName: { type: String, trim: true },
  website:     { type: String, trim: true },
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch(err) {
    console.error("  ❌ bcrypt pre-save error:", err.message);
    next(err);
  }
});

userSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

// ── 5. Express App ─────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "FoundersFuel debug server running 🚀" });
});

// ── REGISTER ───────────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  console.log("\n📥 REGISTER REQUEST:", JSON.stringify(req.body, null, 2));

  try {
    const { fullName, email, password, userType, phone, skills, companyName, website } = req.body;

    // Validation
    if (!fullName || !email || !password || !userType) {
      return res.status(400).json({ success: false, message: "fullName, email, password and userType are required" });
    }
    if (!["fresher", "startup"].includes(userType)) {
      return res.status(400).json({ success: false, message: "userType must be 'fresher' or 'startup'" });
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

    // Check existing
    console.log("  🔍 Checking for existing user...");
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Build user data
    const userData = { fullName: fullName.trim(), email: email.toLowerCase().trim(), password, userType };
    if (userType === "fresher") { userData.phone = phone.trim(); if (skills) userData.skills = skills.trim(); }
    else { userData.companyName = companyName.trim(); if (website) userData.website = website.trim(); }

    console.log("  🔍 Creating user...");
    const user = await User.create(userData);
    console.log("  ✅ User created:", user._id);

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id, fullName: user.fullName, email: user.email,
        userType: user.userType, companyName: user.companyName || null,
        phone: user.phone || null, skills: user.skills || null, website: user.website || null,
      },
    });

  } catch (error) {
    // Print EVERYTHING about the error
    console.error("\n❌❌❌ REGISTER ERROR ❌❌❌");
    console.error("  error.name:    ", error.name);
    console.error("  error.message: ", error.message);
    console.error("  error.code:    ", error.code);
    console.error("  error.stack:   ", error.stack);
    console.error("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌\n");

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: Object.values(error.errors).map(e => e.message).join(", ") });
    }

    // Return the ACTUAL error message in development so you can see it in browser
    return res.status(500).json({
      success: false,
      message: "Server error during registration. Please try again.",
      debug_error_name: error.name,
      debug_error_message: error.message,
      debug_hint: getHint(error),
    });
  }
});

// ── LOGIN ──────────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  console.log("\n📥 LOGIN REQUEST:", JSON.stringify(req.body, null, 2));

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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    console.log("  ✅ Login successful for:", user.email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id, fullName: user.fullName, email: user.email,
        userType: user.userType, companyName: user.companyName || null,
        phone: user.phone || null, skills: user.skills || null, website: user.website || null,
      },
    });

  } catch (error) {
    console.error("\n❌❌❌ LOGIN ERROR ❌❌❌");
    console.error("  error.name:    ", error.name);
    console.error("  error.message: ", error.message);
    console.error("  error.stack:   ", error.stack);
    console.error("❌❌❌❌❌❌❌❌❌❌❌\n");

    return res.status(500).json({
      success: false,
      message: "Server error during login.",
      debug_error_name: error.name,
      debug_error_message: error.message,
      debug_hint: getHint(error),
    });
  }
});

// ── Pass other API routes to original handlers ─────────────────
try {
  app.use("/api/jobs", require("./routes/jobRoutes"));
  app.use("/api/contact", require("./routes/contactRoutes"));
} catch(e) {
  console.warn("⚠️  Could not load job/contact routes:", e.message);
}

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Hint helper ────────────────────────────────────────────────
function getHint(error) {
  const msg = error.message || "";
  if (msg.includes("ECONNREFUSED") || msg.includes("connect ECONNREFUSED")) {
    return "MongoDB is NOT running. Start it locally or use Atlas in .env";
  }
  if (msg.includes("bcrypt") || error.name === "Error" && msg.includes("genSalt")) {
    return "bcryptjs version is incompatible. Delete node_modules and reinstall with bcryptjs ^2.4.3";
  }
  if (msg.includes("ERR_REQUIRE_ESM")) {
    return "A package is ESM-only but project uses CommonJS. Check package versions.";
  }
  if (msg.includes("Cannot find module")) {
    return "Missing module: " + msg + " — run npm install";
  }
  if (error.name === "MongooseServerSelectionError") {
    return "Cannot reach MongoDB. Check MONGO_URI in .env and make sure DB is running.";
  }
  if (error.name === "ValidationError") {
    return "Mongoose validation failed. Check the field values being sent.";
  }
  return "Check terminal output for full error details.";
}

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Debug server running on http://localhost:${PORT}`);
  console.log("📋 Watching for requests — errors will be shown here AND in browser console\n");
});