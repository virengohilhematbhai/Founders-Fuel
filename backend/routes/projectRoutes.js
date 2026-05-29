const express = require("express");
const router = express.Router();
const { submitProject, getAllProjects, deleteProject } = require("../controllers/projectController");
const { protect, fresherOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Fresher submits a project (up to 5 files allowed)
router.post("/", protect, fresherOnly, upload.array("files", 5), submitProject);

// Startups (and Admins) can view all submitted projects
router.get("/", protect, getAllProjects);

// Delete a project
router.delete("/:id", protect, deleteProject);

module.exports = router;
