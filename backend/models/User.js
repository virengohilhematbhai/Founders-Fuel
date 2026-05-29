const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    userType: {
      type: String,
      enum: {
        values: ["fresher", "startup", "admin"],
        message: "userType must be 'fresher', 'startup', or 'admin'",
      },
      required: [true, "User type is required"],
    },
    phone:       { type: String, trim: true },
    skills:      { type: String, trim: true },
    companyName: { type: String, trim: true },
    website:     { type: String, trim: true },
    companyAddress: { type: String, trim: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isBlacklisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    console.error("bcrypt pre-save error:", err.message);
    return next(err);
  }
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);