const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phone: String,
  location: String,
  headline: String,
  summary: String,
  skills: [String],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    current: Boolean
  }],
  experience: [{
    company: String,
    title: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    url: String
  }],
  projects: [{
    name: String,
    description: String,
    url: String
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  }
}, { timestamps: true });

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
