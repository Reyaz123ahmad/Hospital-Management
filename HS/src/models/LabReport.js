const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
  reportId: { type: String, unique: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  testName: { type: String, required: true },
  reportDate: { type: Date, default: Date.now },
  results: [{
    parameter: String,
    value: String,
    unit: String,
    referenceRange: String,
    interpretation: { type: String, enum: ['normal', 'high', 'low', 'critical'], default: 'normal' }
  }],
  summary: String,
  recommendations: String,
  isViewedByPatient: { type: Boolean, default: false },
  isViewedByDoctor: { type: Boolean, default: false }
}, { timestamps: true });

labReportSchema.pre('save', async function(next) {
  if (!this.reportId) {
    const count = await mongoose.model('LabReport').countDocuments();
    this.reportId = `RPT${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('LabReport', labReportSchema);