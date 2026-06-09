const mongoose = require('mongoose');

const labTestStatusSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', required: true },
  status: { type: String, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('LabTestStatus', labTestStatusSchema);