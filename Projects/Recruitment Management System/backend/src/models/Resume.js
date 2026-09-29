const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: String,
  filePath: String,
  fileType: String,
  fileSize: Number,
  parsedText: String,
  aiAnalysis: {
    summary: String,
    skills: [String],
    technicalSkills: [String],
    softSkills: [String],
    education: [String],
    experience: [String],
    certifications: [String],
    projects: [String],
    yearsOfExperience: Number,
    analyzedAt: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
