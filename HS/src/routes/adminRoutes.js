// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

// ==================== USER MANAGEMENT ====================
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.changeUserRole);
router.put('/users/:id/block', adminController.blockUser);
router.put('/users/:id/unblock', adminController.unblockUser);

// ==================== DOCTOR MANAGEMENT ====================
router.post('/doctors', adminController.createDoctor);
router.get('/doctors', adminController.getAllDoctors);

// ==================== PATIENT MANAGEMENT ====================
router.get('/patients', adminController.getAllPatients);

// ==================== APPOINTMENTS ====================
router.get('/appointments/all', adminController.getAllAppointments);


// ==================== DASHBOARD & REPORTS ====================
router.get('/dashboard', adminController.getDashboardStats);
router.get('/reports/appointments', adminController.getAppointmentReport);
router.get('/reports/revenue', adminController.getRevenueReport);
router.get('/reports/doctors', adminController.getDoctorPerformanceReport);

module.exports = router;