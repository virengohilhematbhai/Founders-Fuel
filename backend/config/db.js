const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/foundersfuel";

  mongoose.set("bufferCommands", false);

  if (process.env.VERCEL && (!process.env.MONGO_URI || process.env.MONGO_URI.includes("localhost") || process.env.MONGO_URI.includes("<YOUR_DATABASE_PASSWORD>"))) {
    const errorMsg = "Database Config Missing: MONGO_URI environment variable is not configured in Vercel. Please add your MongoDB Atlas URI in Vercel Project Settings -> Environment Variables.";
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw new Error(`MongoDB Connection Error: Could not connect to database. Ensure MONGO_URI is valid. (${error.message})`);
  }
};

module.exports = connectDB;

