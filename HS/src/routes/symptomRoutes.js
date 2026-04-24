// src/routes/symptomRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const symptomController = require('../controllers/symptomController');

// ==================== PUBLIC ROUTES (No Login Required) ====================
router.get('/', symptomController.getAllSymptoms);
router.post('/analyze', symptomController.analyzeSymptoms);
router.get('/search', symptomController.searchSymptoms);
router.get('/by-category', symptomController.getSymptomsByCategory);

// ==================== ADMIN ONLY ROUTES ====================
router.use(protect);
router.use(authorize('admin'));

// Symptom CRUD
router.post('/', symptomController.createSymptom);
router.put('/:id', symptomController.updateSymptom);
router.delete('/:id', symptomController.deleteSymptom);

// Symptom Mapping CRUD
router.get('/mappings', symptomController.getAllSymptomMappings);
router.get('/mappings/:id', symptomController.getSymptomMappingById);
router.post('/mappings', symptomController.createSymptomMapping);
router.put('/mappings/:id', symptomController.updateSymptomMapping);
router.delete('/mappings/:id', symptomController.deleteSymptomMapping);
router.patch('/mappings/:id/toggle', symptomController.toggleMappingStatus);
router.post('/mappings/bulk', symptomController.bulkCreateSymptomMappings);
router.get('/mappings/symptom/:symptom', symptomController.getMappingsBySymptom);
router.get('/emergency-mappings', symptomController.getEmergencyMappings);

module.exports = router;