const connectDB = require("../backend/config/db");
const app = require("../backend/server");

// Routes that work WITHOUT a database connection
const NO_DB_ROUTES = ["/api/health", "/api/env-check", "/api/test-commit"];

const handler = async (req, res) => {
  // Allow preflight OPTIONS without DB check
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  const path = req.url ? req.url.split("?")[0] : "";

  // Skip DB check for diagnostic routes
  if (NO_DB_ROUTES.includes(path)) {
    return app(req, res);
  }

  // Attempt DB connection before routing
  try {
    await connectDB();
  } catch (dbErr) {
    console.error("Vercel DB Connection Error:", dbErr.message);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(503).json({
      success: false,
      message: "Cannot connect to MongoDB Atlas.",
      hint: "MONGO_URI is not set in Vercel. Go to Vercel Dashboard → Your Project → Settings → Environment Variables → Add MONGO_URI with your MongoDB Atlas connection string → Redeploy.",
      detail: dbErr.message,
    });
  }

  return app(req, res);
};

module.exports = handler;
