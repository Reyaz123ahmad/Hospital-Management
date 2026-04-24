// src/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

router.use(protect);

router.post('/book', appointmentController.bookAppointment);
router.get('/my', appointmentController.getMyAppointments);
router.get('/upcoming', appointmentController.getUpcomingAppointments);
router.get('/past', appointmentController.getPastAppointments);
router.get('/available-slots', appointmentController.getAvailableSlots);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id/cancel', appointmentController.cancelAppointment);
router.put('/:id/reschedule', appointmentController.rescheduleAppointment);

module.exports = router;