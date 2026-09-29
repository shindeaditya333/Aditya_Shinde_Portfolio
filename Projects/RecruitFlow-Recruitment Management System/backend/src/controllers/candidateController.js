const CandidateProfile = require('../models/CandidateProfile');
const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// @desc    Get current candidate profile
// @route   GET /api/candidates/profile
// @access  Private (CANDIDATE)
const getProfile = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user._id }).populate('resume');
    if (!profile) {
      profile = await CandidateProfile.create({ user: req.user._id });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update candidate profile
// @route   PUT /api/candidates/profile
// @access  Private (CANDIDATE)
const updateProfile = async (req, res) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new CandidateProfile({ user: req.user._id });
    }
    
    const updatableFields = ['phone', 'location', 'headline', 'summary', 'skills', 'education', 'experience', 'certifications', 'projects', 'socialLinks'];
    
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload resume
// @route   POST /api/candidates/resume
// @access  Private (CANDIDATE)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

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

    // Check if resume already exists for user
    let existingResume = await Resume.findOne({ candidate: req.user._id });
    
    if (existingResume) {
      // Delete old file
      if (fs.existsSync(existingResume.filePath)) {
        fs.unlinkSync(existingResume.filePath);
      }
      existingResume.fileName = req.file.originalname;
      existingResume.filePath = req.file.path.replace(/\\/g, "/");
      existingResume.fileType = req.file.mimetype;
      existingResume.fileSize = req.file.size;
      existingResume.parsedText = parsedText;
      existingResume.aiAnalysis = null; // reset analysis on new upload
      await existingResume.save();
      
      return res.json(existingResume);
    }

    const newResume = await Resume.create({
      candidate: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path.replace(/\\/g, "/"),
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      parsedText: parsedText
    });

    await CandidateProfile.findOneAndUpdate(
      { user: req.user._id },
      { resume: newResume._id },
      { upsert: true }
    );

    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, uploadResume };
