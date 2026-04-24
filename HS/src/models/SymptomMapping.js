// src/models/SymptomMapping.js
const mongoose = require('mongoose');

const symptomMappingSchema = new mongoose.Schema({
  symptomCombination: [{
    type: String,
    required: true,
    trim: true
  }],
  recommendedSpecializations: [{
    specialization: {
      type: String,
      required: true,
      enum: [
        'General Physician',
        'Cardiologist',
        'Dermatologist',
        'ENT Specialist',
        'Neurologist',
        'Pediatrician',
        'Orthopedic',
        'Gynecologist',
        'Psychiatrist',
        'Ophthalmologist',
        'Gastroenterologist',
        'Urologist',
        'Nephrologist',
        'Pulmonologist',
        'Rheumatologist'
      ]
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10
    },
    matchPercentage: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    notes: String
  }],
  isEmergency: {
    type: Boolean,
    default: false
  },
  emergencyMessage: {
    type: String,
    default: ''
  },
  severityLevel: {
    type: String,
    enum: ['mild', 'moderate', 'severe', 'critical'],
    default: 'mild'
  },
  commonInAgeGroup: {
    type: String,
    enum: ['child', 'adult', 'senior', 'all'],
    default: 'all'
  },
  requiresImmediateAttention: {
    type: Boolean,
    default: false
  },
  typicalDuration: {
    type: String,
    enum: ['few_days', 'one_week', 'two_weeks', 'chronic', 'immediate'],
    default: 'few_days'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster search
symptomMappingSchema.index({ symptomCombination: 1 });
symptomMappingSchema.index({ isEmergency: 1 });
symptomMappingSchema.index({ severityLevel: 1 });

module.exports = mongoose.model('SymptomMapping', symptomMappingSchema);