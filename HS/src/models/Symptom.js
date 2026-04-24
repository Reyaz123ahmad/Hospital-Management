// src/models/Symptom.js
const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['general', 'severe', 'chronic', 'emergency'],
    default: 'general'
  },
  commonCauses: [String],
  homeRemedies: [String],
  whenToSeeDoctor: String,
  icon: String,
  color: String,
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Symptom', symptomSchema);