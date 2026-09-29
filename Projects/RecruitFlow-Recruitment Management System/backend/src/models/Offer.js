const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  salary: { type: Number, required: true },
  benefits: [{ type: String }],
  joiningDate: { type: Date, required: true },
  status: { type: String, enum: ['DRAFT', 'EXTENDED', 'ACCEPTED', 'REJECTED'], default: 'DRAFT' },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offerLetterPath: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
