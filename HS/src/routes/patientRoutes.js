// // src/routes/patientRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const patientController = require('../controllers/patientController');

// router.use(protect);

// router.get('/profile', patientController.getPatientProfile);
// router.put('/profile', patientController.updatePatientProfile);
// router.post('/medical-history', patientController.addMedicalHistory);
// router.get('/medical-history', patientController.getMedicalHistory);
// router.post('/family-member', patientController.addFamilyMember);
// router.get('/family-members', patientController.getFamilyMembers);
// router.get('/prescriptions', patientController.getPrescriptions);
// router.get('/prescriptions/:id/download', patientController.downloadPrescription);


// // Lab aur radiology
// router.get('/lab-tests', patientController.getMyLabTests);
// router.get('/lab-tests/:testId/status', patientController.getLabTestStatus);
// router.get('/lab-reports', patientController.getMyLabReports);
// router.get('/radiology-tests', patientController.getMyRadiologyTests);
// router.get('/radiology-tests/:testId/status', patientController.getRadiologyTestStatus);
// router.get('/radiology-reports', patientController.getMyRadiologyReports);

// module.exports = router;



// src/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const patientController = require('../controllers/patientController');

router.use(protect);

// ==================== SPECIFIC ROUTES FIRST ====================
// Profile routes
router.get('/profile', patientController.getPatientProfile);
router.put('/profile', patientController.updatePatientProfile);

// Medical history routes
router.post('/medical-history', patientController.addMedicalHistory);
router.get('/medical-history', patientController.getMedicalHistory);

// Family members routes
router.post('/family-member', patientController.addFamilyMember);
router.get('/family-members', patientController.getFamilyMembers);

// Prescriptions routes
router.get('/prescriptions', patientController.getPrescriptions);
router.get('/prescriptions/:id/download', patientController.downloadPrescription);

// ==================== LAB & RADIOLOGY ROUTES (SPECIFIC FIRST) ====================
// Lab tests - specific routes
router.get('/lab-tests', patientController.getMyLabTests);
router.get('/lab-reports', patientController.getMyLabReports);
router.get('/lab-tests/:testId/status', patientController.getLabTestStatus);

// Radiology tests - specific routes
router.get('/radiology-tests', patientController.getMyRadiologyTests);
router.get('/radiology-reports', patientController.getMyRadiologyReports);
router.get('/radiology-tests/:testId/status', patientController.getRadiologyTestStatus);

module.exports = router;