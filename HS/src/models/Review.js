// src/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true // One review per appointment
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  isRecommended: {
    type: Boolean,
    default: true
  },
  waitingTime: {
    type: Number, // in minutes
    min: 0,
    max: 180
  },
  cleanliness: {
    type: Number,
    min: 1,
    max: 5
  },
  staffBehavior: {
    type: Number,
    min: 1,
    max: 5
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  helpful: {
    type: Number,
    default: 0
  },
  reply: {
    text: String,
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    repliedAt: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
reviewSchema.index({ doctorId: 1, createdAt: -1 });
reviewSchema.index({ patientId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVerified: 1 });

// Calculate average rating for doctor
reviewSchema.statics.getAverageRating = async function(doctorId) {
  const result = await this.aggregate([
    { $match: { doctorId: mongoose.Types.ObjectId(doctorId), isActive: true } },
    { $group: {
      _id: '$doctorId',
      averageRating: { $avg: '$rating' },
      totalReviews: { $sum: 1 }
    }}
  ]);
  
  return result[0] || { averageRating: 0, totalReviews: 0 };
};

module.exports = mongoose.model('Review', reviewSchema);