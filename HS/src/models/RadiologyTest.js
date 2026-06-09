const mongoose = require('mongoose');

const radiologyTestSchema = new mongoose.Schema({
  testId: { type: String, unique: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  
  // Radiology specific fields
  testType: { 
    type: String, 
    enum: ['xray', 'ultrasound', 'ct_scan', 'mri', 'mammogram', 'fluoroscopy', 'pet_scan'],
    required: true 
  },
  testSubType: { type: String }, // e.g., Chest X-Ray, Abdominal Ultrasound, Brain MRI
  bodyPart: { type: String }, // Chest, Abdomen, Knee, Skull, etc.
  contrastRequired: { type: Boolean, default: false },
  contrastType: { type: String }, // Oral, IV, Both
  
  // Facility details
  radiologyCenter: { type: String, required: true },
  centerAddress: { type: String, required: true },
  centerPhone: { type: String },
  radiologistName: { type: String },
  
  // Patient preparation
  preparationInstructions: { type: String },
  fastingRequired: { type: Boolean, default: false },
  fastingHours: { type: Number, default: 0 },
  pregnancyWarning: { type: Boolean, default: false },
  
  // Emergency and priority
  emergency: { type: Boolean, default: false },
  priority: { type: String, enum: ['routine', 'urgent', 'emergency'], default: 'routine' },
  
  // Status tracking
  status: { 
    type: String, 
    enum: ['pending', 'scheduled', 'arrived', 'images_taken', 'radiologist_review', 'report_ready', 'completed', 'cancelled'],
    default: 'pending' 
  },
  
  // Token and scheduling
  tokenNumber: { type: String, unique: true, sparse: true },
  scheduledDate: Date,
  scheduledTime: String,
  
  // Timestamps
  arrivalTime: Date,
  imagesTakenAt: Date,
  radiologistReviewedAt: Date,
  reportReadyAt: Date,
  completedAt: Date,
  
  // Image URLs (from cloud storage)
  imageUrls: [{ type: String }],
  reportUrl: String,
  
  // Additional notes
  clinicalHistory: { type: String },
  technicianNotes: { type: String },
  radiologistNotes: { type: String }
}, { timestamps: true });

radiologyTestSchema.pre('save', async function(next) {
  if (!this.testId) {
    const count = await mongoose.model('RadiologyTest').countDocuments();
    const prefix = this.testType === 'xray' ? 'XR' : 
                   this.testType === 'ultrasound' ? 'US' :
                   this.testType === 'ct_scan' ? 'CT' :
                   this.testType === 'mri' ? 'MRI' : 'RD';
    this.testId = `${prefix}${String(count + 1).padStart(6, '0')}`;
  }
  if (!this.tokenNumber) {
    this.tokenNumber = `RAD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model('RadiologyTest', radiologyTestSchema);