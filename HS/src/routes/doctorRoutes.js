// src/routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const doctorController = require('../controllers/doctorController');

// Public routes
router.get('/', doctorController.getDoctors);
router.get('/top-rated', doctorController.getTopRatedDoctors);
router.get('/specialization/:spec', doctorController.getDoctorsBySpecialization);
router.get('/:id', doctorController.getDoctorById);
router.get('/:id/availability', doctorController.getDoctorAvailability);

// Doctor only routes
router.use(protect);
router.get('/appointments/my', authorize('doctor'), doctorController.getDoctorAppointments);
router.get('/appointments/today', authorize('doctor'), doctorController.getTodayAppointments);
router.put('/appointments/:id/status', authorize('doctor'), doctorController.updateAppointmentStatus);
router.post('/prescriptions', authorize('doctor'), doctorController.addPrescription);
router.get('/patients/:patientId/history', authorize('doctor'), doctorController.getPatientHistory);
router.put('/:id/availability', authorize('doctor'), doctorController.updateAvailability);
router.put('/:id/profile', authorize('doctor'), doctorController.updateDoctorProfile);

module.exports = router;