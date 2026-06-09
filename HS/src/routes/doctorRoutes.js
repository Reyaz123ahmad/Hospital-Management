// // src/routes/doctorRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');
// const doctorController = require('../controllers/doctorController');

// // Public routes
// router.get('/', doctorController.getDoctors);
// router.get('/top-rated', doctorController.getTopRatedDoctors);
// router.get('/specialization/:spec', doctorController.getDoctorsBySpecialization);
// router.get('/:id', doctorController.getDoctorById);
// router.get('/:id/availability', doctorController.getDoctorAvailability);

// // Doctor only routes
// router.use(protect);
// router.get('/appointments/my', authorize('doctor'), doctorController.getDoctorAppointments);
// router.get('/appointments/today', authorize('doctor'), doctorController.getTodayAppointments);
// router.put('/appointments/:id/status', authorize('doctor'), doctorController.updateAppointmentStatus);
// router.post('/prescriptions', authorize('doctor'), doctorController.addPrescription);
// router.get('/patients/:patientId/history', authorize('doctor'), doctorController.getPatientHistory);
// router.put('/:id/availability', authorize('doctor'), doctorController.updateAvailability);
// router.put('/:id/profile', authorize('doctor'), doctorController.updateDoctorProfile);

// // // Lab aur radiology
// // router.post('/lab-tests', doctorController.createLabTest);
// // router.get('/lab-tests', doctorController.getMyLabTests);
// // router.get('/lab-reports/:reportId', doctorController.getLabReport);
// // router.post('/radiology-tests', doctorController.createRadiologyTest);
// // router.get('/radiology-tests', doctorController.getMyRadiologyTests);
// // router.get('/radiology-reports/:reportId', doctorController.getRadiologyReport);
// // Lab aur radiology - with authorize('doctor')
// router.post('/lab-tests', authorize('doctor'), doctorController.createLabTest);
// router.get('/lab-tests', authorize('doctor'), (req, res) => {
//   console.log('✅✅✅ DIRECT ROUTE HIT ✅✅✅');
//   return res.json({ success: true, tests: [] });
// });
// //router.get('/lab-tests', authorize('doctor'), doctorController.getMyLabTests);
// router.get('/lab-reports/:reportId', authorize('doctor'), doctorController.getLabReport);
// router.post('/radiology-tests', authorize('doctor'), doctorController.createRadiologyTest);
// router.get('/radiology-tests', authorize('doctor'), doctorController.getMyRadiologyTests);
// router.get('/radiology-reports/:reportId', authorize('doctor'), doctorController.getRadiologyReport);
// module.exports = router;




/// src/routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const doctorController = require('../controllers/doctorController');

// ==================== PUBLIC ROUTES ====================
router.get('/', doctorController.getDoctors);
router.get('/top-rated', doctorController.getTopRatedDoctors);
router.get('/specialization/:spec', doctorController.getDoctorsBySpecialization);

// ==================== DOCTOR ONLY ROUTES ====================
router.use(protect);

// LAB TESTS - MUST BE BEFORE ANY :id ROUTES
router.get('/lab-tests', authorize('doctor'), doctorController.getMyLabTests);
router.post('/lab-tests', authorize('doctor'), doctorController.createLabTest);
router.get('/lab-reports/:reportId', authorize('doctor'), doctorController.getLabReport);
router.get('/radiology-tests', authorize('doctor'), doctorController.getMyRadiologyTests);
router.post('/radiology-tests', authorize('doctor'), doctorController.createRadiologyTest);
router.get('/radiology-reports/:reportId', authorize('doctor'), doctorController.getRadiologyReport);
router.get('/appointments/my', authorize('doctor'), doctorController.getDoctorAppointments);
router.get('/appointments/today', authorize('doctor'), doctorController.getTodayAppointments);
router.put('/appointments/:id/status', authorize('doctor'), doctorController.updateAppointmentStatus);
router.post('/prescriptions', authorize('doctor'), doctorController.addPrescription);
router.get('/patients/:patientId/history', authorize('doctor'), doctorController.getPatientHistory);

// ==================== ID ROUTES (MUST BE LAST) ====================
router.get('/:id', doctorController.getDoctorById);
router.get('/:id/availability', doctorController.getDoctorAvailability);
router.put('/:id/availability', authorize('doctor'), doctorController.updateAvailability);
router.put('/:id/profile', authorize('doctor'), doctorController.updateDoctorProfile);

module.exports = router;