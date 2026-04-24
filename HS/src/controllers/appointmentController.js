// src/controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const slotService = require('../services/slotService');
const emailService = require('../services/emailService');
const razorpay = require('../config/razorpay');
// Book appointment
// exports.bookAppointment = async (req, res) => {
//   try {
//     const { doctorId, date, timeSlot, symptoms, notes } = req.body;
    
//     // Check if slot is available
//     const isAvailable = await slotService.isSlotAvailable(doctorId, new Date(date), timeSlot);
//     if (!isAvailable) {
//       return res.status(400).json({ success: false, message: 'Slot not available' });
//     }
    
//     // Get doctor details for fee
//     const doctor = await Doctor.findById(doctorId).populate('userId', 'name');
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: 'Doctor not found' });
//     }
    
//     // Create appointment
//     const appointment = await Appointment.create({
//       patientId: req.user.id,
//       doctorId,
//       date: new Date(date),
//       timeSlot,
//       symptoms: symptoms || [],
//       notes,
//       amount: doctor.consultationFee,
//       status: 'confirmed',
//       paymentStatus: 'pending'
//     });
    
//     // Book the slot
//     await slotService.bookSlot(doctorId, new Date(date), timeSlot, req.user.id, appointment._id);
    
//     // Send confirmation email
//     const patient = await User.findById(req.user.id);
//     await emailService.sendPatientAppointmentConfirmation(
//       patient.email,
//       patient.name,
//       {
//         doctorName: doctor.userId.name,
//         date: new Date(date).toLocaleDateString(),
//         timeSlot,
//         fee: doctor.consultationFee
//       }
//     );
    
//     res.status(201).json({
//       success: true,
//       message: 'Appointment booked successfully',
//       appointment
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// Add this to src/controllers/appointmentController.js

// Book appointment with payment
// exports.bookAppointment = async (req, res) => {
//   try {
//     const { doctorId, date, timeSlot, symptoms, notes } = req.body;
    
//     // Check if slot is available
//     const isAvailable = await slotService.isSlotAvailable(doctorId, new Date(date), timeSlot);
//     if (!isAvailable) {
//       return res.status(400).json({ success: false, message: 'Slot not available' });
//     }
    
//     // Get doctor details
//     const doctor = await Doctor.findById(doctorId).populate('userId', 'name');
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: 'Doctor not found' });
//     }
    
//     // Create appointment with pending payment
//     const appointment = await Appointment.create({
//       patientId: req.user.id,
//       doctorId,
//       date: new Date(date),
//       timeSlot,
//       symptoms: symptoms || [],
//       notes,
//       amount: doctor.consultationFee,
//       status: 'pending',
//       paymentStatus: 'pending'
//     });
    
//     // Book the slot temporarily (will be confirmed after payment)
//     await slotService.bookSlot(doctorId, new Date(date), timeSlot, req.user.id, appointment._id);
    
//     // Create Razorpay order
//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET
//     });
    
//     const options = {
//       amount: doctor.consultationFee * 100,
//       currency: 'INR',
//       receipt: `receipt_${appointment._id}`,
//       notes: {
//         appointmentId: appointment._id.toString()
//       }
//     };
    
//     const order = await razorpay.orders.create(options);
//     appointment.razorpayOrderId = order.id;
//     await appointment.save();
    
//     res.status(201).json({
//       success: true,
//       appointment,
//       order: {
//         id: order.id,
//         amount: order.amount,
//         currency: order.currency
//       },
//       key_id: process.env.RAZORPAY_KEY_ID
//     });
    
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms, notes } = req.body;
    
    // Check if slot is available
    const isAvailable = await slotService.isSlotAvailable(doctorId, new Date(date), timeSlot);
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: 'Slot not available' });
    }
    
    // Get doctor details
    const doctor = await Doctor.findById(doctorId).populate('userId', 'name');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date: new Date(date),
      timeSlot,
      symptoms: symptoms || [],
      notes,
      amount: doctor.consultationFee,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    // Book the slot
    await slotService.bookSlot(doctorId, new Date(date), timeSlot, req.user.id, appointment._id);
    
    // ✅ DIRECT USE KAR - NAYA INSTANCE MAT BANA
    const options = {
      amount: Math.round(doctor.consultationFee * 100), // Math.round for safety
      currency: 'INR',
      receipt: `receipt_${appointment._id}`,
      notes: {
        appointmentId: appointment._id.toString()
      }
    };
    
    const order = await razorpay.orders.create(options); // ✅ Seedha use kar
    
    appointment.razorpayOrderId = order.id;
    await appointment.save();
    
    res.status(201).json({
      success: true,
      appointment: {
        id: appointment._id,
        doctorName: doctor.userId.name,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        amount: appointment.amount
      },
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      key_id: process.env.RAZORPAY_KEY_ID
    });
    
  } catch (error) {
    console.error('Booking error:', error); // Debug ke liye
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patient's appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    
    let query = { patientId: req.user.id };
    if (status) query.status = status;
    
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = { $in: ['confirmed', 'pending'] };
    }
    
    const appointments = await Appointment.find(query)
      .populate('doctorId', 'specialization consultationFee')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort('-date');
    
    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate('doctorId')
      .populate('prescriptionId');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Check authorization
    if (appointment.patientId._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const appointment = await Appointment.findById(id)
      .populate('patientId', 'name email')
      .populate('doctorId');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Check if cancellation is within policy (1 hour before)
    const appointmentTime = new Date(appointment.date);
    appointmentTime.setHours(parseInt(appointment.timeSlot.split(':')[0]));
    const hoursDiff = (appointmentTime - new Date()) / (1000 * 60 * 60);
    
    if (hoursDiff < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel appointment less than 1 hour before appointment time' 
      });
    }
    
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    await appointment.save();
    
    // Release the slot
    await slotService.releaseSlot(appointment.doctorId, appointment.date, appointment.timeSlot);
    
    // Send cancellation email
    await emailService.sendAppointmentCancellation(
      appointment.patientId.email,
      appointment.patientId.name,
      {
        doctorName: appointment.doctorId.userId?.name,
        date: appointment.date.toLocaleDateString(),
        timeSlot: appointment.timeSlot
      },
      reason
    );
    
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reschedule appointment
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTimeSlot, reason } = req.body;
    
    const appointment = await Appointment.findById(id)
      .populate('patientId', 'name email')
      .populate('doctorId');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Check if new slot is available
    const isAvailable = await slotService.isSlotAvailable(
      appointment.doctorId._id, 
      new Date(newDate), 
      newTimeSlot
    );
    
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: 'New slot not available' });
    }
    
    // Store old slot info
    const oldDate = appointment.date;
    const oldTimeSlot = appointment.timeSlot;
    
    // Release old slot
    await slotService.releaseSlot(appointment.doctorId._id, appointment.date, appointment.timeSlot);
    
    // Book new slot
    await slotService.bookSlot(
      appointment.doctorId._id, 
      new Date(newDate), 
      newTimeSlot, 
      appointment.patientId._id, 
      appointment._id
    );
    
    // Update appointment
    appointment.rescheduleHistory.push({
      oldDate,
      oldTimeSlot,
      newDate: new Date(newDate),
      newTimeSlot,
      reason,
      rescheduledAt: new Date()
    });
    
    appointment.date = new Date(newDate);
    appointment.timeSlot = newTimeSlot;
    appointment.status = 'rescheduled';
    await appointment.save();
    
    // Send email
    await emailService.sendAutoRescheduleNotification(
      appointment.patientId.email,
      appointment.patientId.name,
      { date: oldDate, timeSlot: oldTimeSlot },
      { date: new Date(newDate), timeSlot: newTimeSlot }
    );
    
    res.json({ success: true, message: 'Appointment rescheduled successfully', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available slots for a doctor
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    
    if (!doctorId || !date) {
      return res.status(400).json({ success: false, message: 'Doctor ID and date are required' });
    }
    
    const availableSlots = await slotService.getAvailableSlots(doctorId, new Date(date));
    
    res.json({
      success: true,
      doctorId,
      date,
      availableSlots
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id,
      date: { $gte: new Date() },
      status: { $in: ['confirmed', 'pending'] }
    })
      .populate('doctorId')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort('date');
    
    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get past appointments
exports.getPastAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id,
      date: { $lt: new Date() }
    })
      .populate('doctorId')
      .populate('prescriptionId')
      .sort('-date');
    
    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};