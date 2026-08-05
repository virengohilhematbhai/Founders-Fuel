const connectDB = require("../backend/config/db");
const app = require("../backend/server");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (dbErr) {
    console.error("Vercel DB Connection Error:", dbErr.message);
    if (req.url && req.url.includes("/api/")) {
      return res.status(503).json({
        success: false,
        message: dbErr.message || "Database connection failed. Please configure MONGO_URI in Vercel environment variables."
      });
    }
  }
  return app(req, res);
};
