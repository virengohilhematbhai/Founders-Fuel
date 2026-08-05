const connectDB = require("../config/db");
const app = require("../server");

module.exports = async (req, res) => {
  // Ensure DB connection is established before handling request
  await connectDB();
  return app(req, res);
};
