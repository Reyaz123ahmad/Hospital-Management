const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
  testId: { type: String, unique: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  testName: { type: String, required: true },
  testCategory: { type: String, enum: ['blood', 'urine', 'imaging', 'cardiac', 'stool', 'other'], default: 'blood' },
  labName: { type: String, required: true },
  labAddress: { type: String, required: true },
  instructions: { type: String, default: '' },
  fastingRequired: { type: Boolean, default: false },
  fastingHours: { type: Number, default: 0 },
  emergency: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'scheduled', 'sample_collected', 'processing', 'completed', 'cancelled'], default: 'pending' },
  tokenNumber: { type: String, unique: true, sparse: true },
  scheduledDate: Date,
  sampleCollectedAt: Date,
  processingStartedAt: Date,
  completedAt: Date,
  reportUrl: String
}, { timestamps: true });

labTestSchema.pre('save', async function(next) {
  if (!this.testId) {
    const count = await mongoose.model('LabTest').countDocuments();
    this.testId = `LAB${String(count + 1).padStart(6, '0')}`;
  }
  if (!this.tokenNumber) {
    this.tokenNumber = `TKN${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model('LabTest', labTestSchema);