const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public (Only OPEN jobs for public, All for Admin/Recruiter)
const getJobs = async (req, res) => {
  try {
    let query = {};
    if (!req.user || req.user.role === 'CANDIDATE') {
      query.status = 'OPEN';
    } else if (req.user.role === 'RECRUITER') {
      // Recruiter might want to see their own jobs or all jobs, let's say all jobs for now
    }

    // Search & Filter
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { department: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.location) query.location = { $regex: req.query.location, $options: 'i' };
    if (req.query.department) query.department = req.query.department;
    if (req.query.workMode) query.workMode = req.query.workMode;

    const jobs = await Job.find(query).populate('createdBy', 'name email').sort('-createdAt');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    // If Candidate, can only see OPEN jobs
    if ((!req.user || req.user.role === 'CANDIDATE') && job.status !== 'OPEN') {
      return res.status(404).json({ message: 'Job not found or closed' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (RECRUITER, ADMIN)
const createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      createdBy: req.user._id
    });
    
    // Convert comma separated skills to arrays
    if (typeof job.requiredSkills === 'string') job.requiredSkills = job.requiredSkills.split(',').map(s=>s.trim());
    if (typeof job.preferredSkills === 'string') job.preferredSkills = job.preferredSkills.split(',').map(s=>s.trim());

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (RECRUITER, ADMIN)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check ownership if needed (simplified here)
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job status
// @route   PATCH /api/jobs/:id/status
// @access  Private (RECRUITER, ADMIN)
const updateJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    job.status = req.body.status;
    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (RECRUITER, ADMIN)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, updateJobStatus, deleteJob };
