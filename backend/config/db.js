const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/foundersfuel";

  mongoose.set("bufferCommands", false);

  const isPlaceholder = !process.env.MONGO_URI || 
                      process.env.MONGO_URI.includes("localhost") || 
                      process.env.MONGO_URI.includes("<YOUR_DATABASE_PASSWORD>") || 
                      process.env.MONGO_URI.includes("cluster0.xxxxx");

  if (process.env.VERCEL && isPlaceholder) {
    const errorMsg = "Database Config Missing: MONGO_URI environment variable in Vercel contains placeholder values (<YOUR_DATABASE_PASSWORD>). Please replace MONGO_URI with a valid MongoDB Atlas connection string in Vercel Project Settings -> Environment Variables.";
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

