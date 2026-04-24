// src/models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  consultationFee: {
    type: Number,
    required: true
  },
  treatsSymptoms: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  availableSlots: [{
    date: {
      type: Date,
      required: true
    },
    startTime: String,
    endTime: String,
    slots: [{
      time: String,
      isBooked: {
        type: Boolean,
        default: false
      },
      bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
      }
    }],
    totalSlots: Number,
    bookedSlots: {
      type: Number,
      default: 0
    },
    isFullyBooked: {
      type: Boolean,
      default: false
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);