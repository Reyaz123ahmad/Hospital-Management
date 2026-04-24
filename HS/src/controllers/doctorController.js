// src/controllers/doctorController.js
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const slotService = require('../services/slotService');
const emailService = require('../services/emailService');
const { DOCTOR_TIMINGS } = require('../config/constants');

// Get all doctors with filters
exports.getDoctors = async (req, res) => {
  try {
    const { specialization, minExperience, maxFee, rating } = req.query;
    
    let query = { isAvailable: true };
    
    if (specialization) query.specialization = specialization;
    if (minExperience) query.experience = { $gte: parseInt(minExperience) };
    if (maxFee) query.consultationFee = { $lte: parseInt(maxFee) };
    if (rating) query.rating = { $gte: parseInt(rating) };
    
    const doctors = await Doctor.find(query).populate('userId', 'name email phone profileImage');
    
    res.json({ success: true, count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single doctor
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email phone');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctors by specialization
exports.getDoctorsBySpecialization = async (req, res) => {
  try {
    const { spec } = req.params;
    const doctors = await Doctor.find({ specialization: spec, isAvailable: true })
      .populate('userId', 'name email phone');
    
    res.json({ success: true, count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor availability slots
exports.getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }
    
    const availableSlots = await slotService.getAvailableSlots(id, new Date(date));
    
    res.json({
      success: true,
      doctorId: id,
      date,
      availableSlots
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor availability (doctor only)
exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, slots } = req.body;
    
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Check if logged in user is the doctor or admin
    if (req.user.role !== 'admin' && doctor.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await slotService.generateSlotsForDate(id, new Date(date));
    
    res.json({ success: true, message: 'Availability updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor && req.user.role !== 'admin') {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }
    
    const doctorId = req.params.id || doctor._id;
    const { status, date } = req.query;
    
    let query = { doctorId };
    if (status) query.status = status;
    if (date) {
      query.date = {
        $gte: new Date(date).setHours(0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59)
      };
    }
    
    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone')
      .sort('date');
    
    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get today's appointments
exports.getTodayAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointments = await Appointment.find({
      doctorId: doctor._id,
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['confirmed', 'pending'] }
    }).populate('patientId', 'name email phone');
    
    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointment = await Appointment.findById(id)
      .populate('patientId', 'name email')
      .populate('doctorId');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    appointment.status = status;
    await appointment.save();
    
    // Send email notification
    if (status === 'completed') {
      await emailService.sendEmail(
        appointment.patientId.email,
        'Appointment Completed',
        `<p>Your appointment with Dr. ${appointment.doctorId.userId?.name} has been completed.</p>`
      );
    }
    
    res.json({ success: true, message: 'Appointment status updated', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add prescription
exports.addPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, diagnosis, advice, followUpDate, tests } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    const prescription = await Prescription.create({
      appointmentId,
      doctorId: doctor._id,
      patientId: appointment.patientId,
      medicines,
      diagnosis,
      advice,
      followUpDate,
      tests
    });
    
    appointment.prescriptionId = prescription._id;
    appointment.status = 'completed';
    await appointment.save();
    
    // Send email
    const patient = await User.findById(appointment.patientId);
    await emailService.sendEmail(
      patient.email,
      'Prescription Generated',
      `<p>Your prescription has been generated. Please login to view.</p>`
    );
    
    res.status(201).json({ success: true, prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patient history for doctor
exports.getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'specialization')
      .populate('prescriptionId');
    
    const prescriptions = await Prescription.find({ patientId });
    
    res.json({
      success: true,
      appointments,
      prescriptions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor profile
exports.updateDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { qualification, experience, consultationFee, treatsSymptoms } = req.body;
    
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    if (qualification) doctor.qualification = qualification;
    if (experience) doctor.experience = experience;
    if (consultationFee) doctor.consultationFee = consultationFee;
    if (treatsSymptoms) doctor.treatsSymptoms = treatsSymptoms;
    
    await doctor.save();
    
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get top rated doctors
exports.getTopRatedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isAvailable: true })
      .sort({ rating: -1 })
      .limit(10)
      .populate('userId', 'name email phone');
    
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};