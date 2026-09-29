const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['TECHNICAL', 'HR', 'BEHAVIORAL', 'SYSTEM_DESIGN'], default: 'TECHNICAL' },
  status: { type: String, enum: ['SCHEDULED', 'COMPLETED', 'CANCELED'], default: 'SCHEDULED' },
  meetingLink: { type: String },
  notes: { type: String },
  score: { type: Number, min: 1, max: 10 },
  feedback: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
