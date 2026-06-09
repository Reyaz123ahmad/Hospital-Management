const mongoose = require('mongoose');

const radiologyReportSchema = new mongoose.Schema({
  reportId: { type: String, unique: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'RadiologyTest', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  
  testType: { type: String, required: true },
  testName: { type: String, required: true },
  bodyPart: { type: String },
  
  // Report sections
  findings: { type: String, required: true },
  impression: { type: String, required: true },
  recommendations: { type: String },
  
  // Structured findings for different test types
  measurements: [{
    parameter: String,
    value: String,
    unit: String,
    normalRange: String,
    status: { type: String, enum: ['normal', 'abnormal', 'critical'], default: 'normal' }
  }],
  
  // Image quality and technique
  technique: { type: String },
  imageQuality: { type: String, enum: ['optimal', 'suboptimal', 'limited'], default: 'optimal' },
  limitations: { type: String },
  
  // Comparison with previous studies
  comparisonStudy: { type: String },
  
  // Review status
  isReviewedByPatient: { type: Boolean, default: false },
  isReviewedByDoctor: { type: Boolean, default: false },
  
  // PDF and image URLs
  pdfUrl: { type: String },
  keyImages: [{ type: String }],
  
  reportDate: { type: Date, default: Date.now }
}, { timestamps: true });

radiologyReportSchema.pre('save', async function(next) {
  if (!this.reportId) {
    const count = await mongoose.model('RadiologyReport').countDocuments();
    this.reportId = `RAD_RPT${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('RadiologyReport', radiologyReportSchema);