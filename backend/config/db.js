const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/foundersfuel";

  if (process.env.VERCEL && (!process.env.MONGO_URI || process.env.MONGO_URI.includes("localhost"))) {
    const errorMsg = "Database Error: MONGO_URI environment variable is missing or set to localhost on Vercel. Please set MONGO_URI to a valid MongoDB Atlas connection string in your Vercel Project Environment Variables.";
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw new Error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;

