// src/models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  allergies: [String],
  medicalHistory: [{
    disease: String,
    diagnosedDate: Date,
    treatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    notes: String
  }],
  familyMembers: [{
    name: { type: String, required: true },
    relation: { type: String, required: true },
    age: { type: Number, required: true },
    medicalHistory: { type: String, default: '' },
    addedAt: { type: Date, default: Date.now }
  }],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);