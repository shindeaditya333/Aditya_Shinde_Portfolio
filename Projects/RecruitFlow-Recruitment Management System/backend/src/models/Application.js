const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  status: { 
    type: String, 
    enum: ['APPLIED', 'SCREENING', 'SHORTLISTED', 'REJECTED', 'INTERVIEW', 'SELECTED', 'ON_HOLD', 'OFFERED', 'OFFER_EXTENDED', 'HIRED'], 
    default: 'APPLIED' 
  },
  aiScore: { type: Number },
  aiRecommendation: { type: String },
  aiAnalysis: {
    matchSummary: String,
    matchingSkills: [String],
    missingSkills: [String],
    technicalSkillsMatch: String,
    experienceMatch: String,
    educationMatch: String,
    relevantProjects: String,
    experienceRelevance: String,
    strengths: [String],
    weaknesses: [String],
    reasoning: String
  },
  aiStatus: { type: String, enum: ['NOT_ANALYZED', 'ANALYZING', 'ANALYZED', 'FAILED'], default: 'NOT_ANALYZED' },
  interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }],
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
  timeline: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String
  }]
}, { timestamps: true });

// prevent duplicate applications
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
