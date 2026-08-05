const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/foundersfuel";

  mongoose.set("bufferCommands", false);

  try {
    const conn = await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 4000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw new Error(`Database Error: Could not connect to MongoDB. Please set MONGO_URI in Vercel project environment variables.`);
  }
};

module.exports = connectDB;

