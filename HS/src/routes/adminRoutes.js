// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const salaryController = require('../controllers/salaryController')
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

// Salary Templates
router.post('/salary-templates', salaryController.createSalaryTemplate);
router.get('/salary-templates', salaryController.getSalaryTemplates);

// Salary Generation
router.post('/salary/generate', salaryController.generateSalary);
router.get('/salaries', salaryController.getAllSalaries);
router.put('/salary/:id/paid', salaryController.markSalaryPaid);

// Leave Management
router.get('/leaves/pending', salaryController.getPendingLeaves);
router.put('/leave/:id/approve', salaryController.approveLeave);
router.get('/leave-balance/:userId', salaryController.getLeaveBalance);

// Attendance
router.post('/attendance/mark', salaryController.markAttendance);

// ==================== STAFF MANAGEMENT ====================
router.post('/staff', salaryController.createStaff);
router.get('/staff', salaryController.getAllStaff);
router.put('/staff/:id/salary', salaryController.updateStaffSalary);

// ==================== PATIENT MANAGEMENT ====================
router.get('/patients', adminController.getAllPatients);

// ==================== APPOINTMENTS ====================
router.get('/appointments/all', adminController.getAllAppointments);


// ==================== DASHBOARD & REPORTS ====================
router.get('/dashboard', adminController.getDashboardStats);
router.get('/reports/appointments', adminController.getAppointmentReport);
router.get('/reports/revenue', adminController.getRevenueReport);
router.get('/reports/doctors', adminController.getDoctorPerformanceReport);

// Lab aur radiology
router.get('/lab-tests', adminController.getAllLabTests);
router.get('/lab-reports', adminController.getAllLabReports);
router.get('/radiology-tests', adminController.getAllRadiologyTests);
router.get('/radiology-reports', adminController.getAllRadiologyReports);

module.exports = router;