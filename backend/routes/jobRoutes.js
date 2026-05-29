const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getMyJobs,
  deleteApplication,
} = require("../controllers/jobController");
const { protect, startupOnly, fresherOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllJobs);

// Named protected routes — declared BEFORE /:id wildcard so they aren't swallowed
router.get("/startup/my-jobs", protect, startupOnly, getMyJobs);

// Wildcard (must come AFTER all named routes)
router.get("/:id", getJobById);

// Other protected routes
router.post("/", protect, startupOnly, createJob);
router.put("/:id", protect, startupOnly, updateJob);
router.delete("/:id", protect, startupOnly, deleteJob);
router.post("/:id/apply", protect, fresherOnly, applyToJob);
router.delete("/:id/application/:applicantId", protect, deleteApplication);

module.exports = router;