const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../models/User");

// Load env vars from backend/.env
dotenv.config({ path: path.join(__dirname, "../.env") });

const createAdmin = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI not found in .env file");
    }

    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    const adminEmail = "virengohil0901@gmail.com";
    const adminPassword = "Viren@0901";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user ${adminEmail} already exists.`);
      // Update password just in case
      existingAdmin.password = adminPassword;
      existingAdmin.userType = "admin";
      existingAdmin.fullName = "Super Admin";
      await existingAdmin.save();
      console.log("Admin account updated successfully.");
    } else {
      // Create new admin
      await User.create({
        fullName: "Super Admin",
        email: adminEmail,
        password: adminPassword,
        userType: "admin"
      });
      console.log(`Admin user ${adminEmail} created successfully.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating/updating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
