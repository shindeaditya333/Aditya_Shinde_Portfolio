const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
  responsibilities: { type: String, required: true },
  requiredSkills: [{ type: String }],
  preferredSkills: [{ type: String }],
  experienceLevel: { type: String, required: true },
  education: { type: String },
  location: { type: String, required: true },
  workMode: { type: String, enum: ['ONSITE', 'REMOTE', 'HYBRID'], default: 'ONSITE' },
  employmentType: { type: String, enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'], default: 'FULL_TIME' },
  salaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  vacancies: { type: Number, default: 1 },
  applicationDeadline: { type: Date },
  status: { type: String, enum: ['DRAFT', 'OPEN', 'CLOSED'], default: 'DRAFT' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
