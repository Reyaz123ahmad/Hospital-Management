// src/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const patientController = require('../controllers/patientController');

router.use(protect);

router.get('/profile', patientController.getPatientProfile);
router.put('/profile', patientController.updatePatientProfile);
router.post('/medical-history', patientController.addMedicalHistory);
router.get('/medical-history', patientController.getMedicalHistory);
router.post('/family-member', patientController.addFamilyMember);
router.get('/family-members', patientController.getFamilyMembers);
router.get('/prescriptions', patientController.getPrescriptions);
router.get('/prescriptions/:id/download', patientController.downloadPrescription);

module.exports = router;