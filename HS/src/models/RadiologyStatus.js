const mongoose = require('mongoose');

const radiologyStatusSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'RadiologyTest', required: true },
  status: { type: String, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('RadiologyStatus', radiologyStatusSchema);