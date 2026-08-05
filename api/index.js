const connectDB = require("../backend/config/db");
const app = require("../backend/server");

// Override server error handler to give clean JSON in serverless context
const handler = async (req, res) => {
  // Allow preflight OPTIONS without DB check
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // Environment check route — does NOT require DB
  if (req.url === "/api/env-check" || req.url === "/api/env-check/") {
    const hasMongo = !!process.env.MONGO_URI;
    const hasJwt = !!process.env.JWT_SECRET;
    const mongoPreview = hasMongo
      ? process.env.MONGO_URI.replace(/:([^@]+)@/, ":<hidden>@").substring(0, 60) + "..."
      : "NOT SET";
    return res.status(200).json({
      success: true,
      env: {
        MONGO_URI_SET: hasMongo,
        MONGO_URI_PREVIEW: mongoPreview,
        JWT_SECRET_SET: hasJwt,
        NODE_ENV: process.env.NODE_ENV || "not set",
        FRONTEND_URL: process.env.FRONTEND_URL || "not set",
        VERCEL: process.env.VERCEL || "not set",
      },
    });
  }

  // Attempt DB connection before routing
  try {
    await connectDB();
  } catch (dbErr) {
    console.error("Vercel DB Connection Error:", dbErr.message);
    return res.status(503).json({
      success: false,
      message: "Cannot connect to MongoDB database.",
      hint: "Please add MONGO_URI in Vercel Project Settings → Environment Variables and redeploy.",
      detail: dbErr.message,
    });
  }

  return app(req, res);
};

module.exports = handler;
