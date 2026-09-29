const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { analyzeResumeMatch } = require('../services/aiService');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId/apply
// @access  Private (CANDIDATE)
const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== 'OPEN') {
      return res.status(404).json({ message: 'Job not available' });
    }

    // Check if already applied
    const existing = await Application.findOne({ job: job._id, candidate: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    
    // Parse the form data
    const { name, email, contactNumber } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume' });
    }

    // Process uploaded file
    let parsedText = '';
    if (req.file.mimetype === 'application/pdf') {
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        parsedText = data.text;
      } catch (parseError) {
        console.error('Error parsing PDF:', parseError);
      }
    }
    
    let resume = await Resume.findOne({ candidate: req.user._id });
    if (resume) {
      if (fs.existsSync(resume.filePath)) {
        fs.unlinkSync(resume.filePath);
      }
      resume.fileName = req.file.originalname;
      resume.filePath = req.file.path.replace(/\\/g, "/");
      resume.fileType = req.file.mimetype;
      resume.fileSize = req.file.size;
      resume.parsedText = parsedText;
      resume.aiAnalysis = null;
      await resume.save();
    } else {
      resume = await Resume.create({
        candidate: req.user._id,
        fileName: req.file.originalname,
        filePath: req.file.path.replace(/\\/g, "/"),
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        parsedText: parsedText
      });
      await CandidateProfile.findOneAndUpdate(
        { user: req.user._id },
        { resume: resume._id },
        { upsert: true }
      );
    }
    
    // Update User Name if it was changed
    if (name && name !== req.user.name) {
        await User.findByIdAndUpdate(req.user._id, { name });
    }
    // Update phone if provided
    if (contactNumber) {
        await CandidateProfile.findOneAndUpdate(
            { user: req.user._id },
            { phone: contactNumber },
            { upsert: true }
        );
    }

    const application = new Application({
      job: job._id,
      candidate: req.user._id,
      resume: resume._id,
      status: 'APPLIED',
      timeline: [{
        status: 'APPLICATION_SUBMITTED',
        note: 'Candidate submitted the application.'
      }]
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get candidate's applications
// @route   GET /api/applications/my
// @access  Private (CANDIDATE)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title department location workMode')
      .sort('-createdAt');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications (Recruiter global view)
// @route   GET /api/applications
// @access  Private (RECRUITER, ADMIN)
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate('candidate', 'name email')
      .populate('job', 'title')
      .populate('resume')
      .sort('-createdAt');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applications for a job (Recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (RECRUITER, ADMIN)
const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email')
      .populate('resume')
      .sort('-createdAt'); // Default sort by date
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (RECRUITER, ADMIN)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    
    application.status = status;
    application.timeline.push({
      status: status,
      note: `Status updated to ${status}`
    });
    
    await application.save();
    
    // Re-fetch with populated fields so frontend always has full objects
    const populated = await Application.findById(application._id)
      .populate('candidate', 'name email')
      .populate('resume');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Trigger AI Analysis for an Application
// @route   POST /api/applications/:id/analyze
// @access  Private (RECRUITER, ADMIN)
const analyzeApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('resume');
      
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (!application.resume || !application.resume.parsedText || application.resume.parsedText.trim() === '') {
      return res.status(400).json({ message: 'Cannot analyze: Resume text is missing or could not be parsed from the PDF.' });
    }
    
    application.aiStatus = 'ANALYZING';
    await application.save();
    
    try {
      const aiResult = await analyzeResumeMatch(application.job, application.resume.parsedText);
      
      application.aiScore = aiResult.score;
      application.aiRecommendation = aiResult.recommendation;
      application.aiAnalysis = {
        matchSummary: aiResult.matchSummary,
        matchingSkills: aiResult.matchingSkills,
        missingSkills: aiResult.missingSkills,
        technicalSkillsMatch: aiResult.technicalSkillsMatch,
        experienceMatch: aiResult.experienceMatch,
        educationMatch: aiResult.educationMatch,
        relevantProjects: aiResult.relevantProjects,
        experienceRelevance: aiResult.experienceRelevance,
        strengths: aiResult.strengths,
        weaknesses: aiResult.weaknesses,
        reasoning: aiResult.reasoning
      };
      application.aiStatus = 'ANALYZED';
      
      await application.save();
      res.json(application);
    } catch (aiError) {
      console.error('AI Analysis Error:', aiError);
      application.aiStatus = 'FAILED';
      await application.save();
      return res.status(500).json({ message: 'AI Analysis failed', error: aiError.message });
    }
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyToJob, getMyApplications, getAllApplications, getJobApplications, updateApplicationStatus, analyzeApplication };
