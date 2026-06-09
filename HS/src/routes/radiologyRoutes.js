const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const radiologyController = require('../controllers/radiologyController');

router.use(protect);

// Lab/Radiology Center Routes
router.get('/verify-token/:tokenNumber', radiologyController.verifyToken);
router.post('/:tokenNumber/arrive', radiologyController.markArrived);
router.post('/:tokenNumber/images', radiologyController.imagesTaken);
router.post('/:tokenNumber/review', radiologyController.radiologistReview);
router.post('/:tokenNumber/complete', radiologyController.completeTest);

// Patient Routes
router.get('/my-tests', authorize('patient'), radiologyController.getMyRadiologyTests);
router.get('/my-reports', authorize('patient'), radiologyController.getMyRadiologyReports);
router.get('/report/:id', authorize('patient'), radiologyController.getReportById);

// Doctor Routes
router.post('/create', authorize('doctor'), radiologyController.createRadiologyTest);
router.get('/doctor/tests', authorize('doctor'), radiologyController.getDoctorRadiologyTests);

module.exports = router;