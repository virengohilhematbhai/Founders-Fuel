const Job = require("../models/Job");

// @desc    Get all open jobs (with optional filters)
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res, next) => {
  try {
    const { type, tag, status } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    else filter.status = "open";
    if (tag) filter.tags = { $in: [new RegExp(tag, "i")] };

    const jobs = await Job.find(filter)
      .populate("postedBy", "fullName companyName email website")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "fullName companyName email website"
    );
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Startup only)
const createJob = async (req, res, next) => {
  try {
    const { title, description, tags, duration, stipend, type } = req.body;

    const job = await Job.create({
      title,
      company: req.user.companyName || req.user.fullName,
      description,
      tags,
      duration,
      stipend,
      type,
      postedBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Job posted successfully", job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Startup owner only)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Only the startup who posted can update
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this job" });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: "Job updated successfully", job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Startup owner only)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to a job (fresher)
// @route   POST /api/jobs/:id/apply
// @access  Private (Fresher only)
const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    if (job.status === "closed") {
      return res.status(400).json({ success: false, message: "This job is no longer accepting applications" });
    }

    // Check if already applied
    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "You have already applied to this job" });
    }

    job.applicants.push(req.user._id);
    await job.save();

    res.status(200).json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by logged-in startup
// @route   GET /api/jobs/my-jobs
// @access  Private (Startup only)
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate("applicants", "fullName email skills phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job application
// @route   DELETE /api/jobs/:id/application/:applicantId
// @access  Private
const deleteApplication = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    
    const applicantId = req.params.applicantId;

    // Authorization check
    // req.user._id can be an object id, we need toString()
    const isFresherSelf = req.user._id.toString() === applicantId;
    const isStartupOwner = job.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.userType === "admin";

    if (!isFresherSelf && !isStartupOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this application" });
    }

    // Remove applicant from array
    job.applicants = job.applicants.filter(
      (id) => id.toString() !== applicantId
    );
    await job.save();

    res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob, applyToJob, getMyJobs, deleteApplication };