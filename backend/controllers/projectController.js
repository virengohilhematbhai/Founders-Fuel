const Project = require("../models/Project");

exports.submitProject = async (req, res, next) => {
  try {
    const { name, email, phone, projectTitle, description } = req.body;
    
    // Process files if available
    const fileUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        // Build url like /uploads/filename.ext
        fileUrls.push(`/uploads/${file.filename}`);
      });
    }

    const project = await Project.create({
      name,
      email,
      phone,
      projectTitle,
      description,
      fileUrls,
      submittedBy: req.user.id,
    });

    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().populate("submittedBy", "fullName email companyName").sort("-createdAt");
    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};
