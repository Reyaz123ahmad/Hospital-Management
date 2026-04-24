// src/controllers/reviewController.js
const Review = require('../models/Review');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Add review
exports.addReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment, isRecommended } = req.body;
    
    // Check if appointment exists and is completed
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patientId: req.user.id,
      status: 'completed'
    });
    
    if (!appointment) {
      return res.status(400).json({ 
        success: false, 
        message: 'You can only review completed appointments' 
      });
    }
    
    // Check if already reviewed
    const existingReview = await Review.findOne({ appointmentId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'Already reviewed this appointment' });
    }
    
    const review = await Review.create({
      appointmentId,
      doctorId: appointment.doctorId,
      patientId: req.user.id,
      rating,
      comment,
      isRecommended
    });
    
    // Update doctor rating
    const doctor = await Doctor.findById(appointment.doctorId);
    const allReviews = await Review.find({ doctorId: appointment.doctorId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    doctor.rating = avgRating;
    doctor.totalReviews = allReviews.length;
    await doctor.save();
    
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor reviews
exports.getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const reviews = await Review.find({ doctorId })
      .populate('patientId', 'name')
      .sort('-createdAt');
    
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    const review = await Review.findOneAndUpdate(
      { _id: id, patientId: req.user.id },
      { rating, comment },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOneAndDelete({ _id: id, patientId: req.user.id });
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ patientId: req.user.id })
      .populate('doctorId')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort('-createdAt');
    
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};