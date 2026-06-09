// const express = require('express');
// const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');
// const labController = require('../controllers/labController');

// router.use(protect);

// // Lab Staff Routes (Token Verification)
// router.get('/verify-token/:tokenNumber', labController.verifyToken);
// router.post('/:tokenNumber/collect-sample', labController.collectSample);
// router.post('/:tokenNumber/start-processing', labController.startProcessing);
// router.post('/:tokenNumber/complete', labController.completeTest);

// // Patient Routes
// router.get('/my-tests', authorize('patient'), labController.getMyLabTests);
// router.get('/my-reports', authorize('patient'), labController.getMyReports);
// router.get('/report/:id', authorize('patient'), labController.getReportById);

// // Doctor Routes
// router.post('/create', authorize('doctor'), labController.createLabTest);
// router.get('/doctor/tests', authorize('doctor'), labController.getDoctorLabTests);

// module.exports = router;





const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const labController = require('../controllers/labController');

router.use(protect);
router.use(authorize('lab_staff')); // Lab staff role

router.get('/verify/:tokenNumber', labController.verifyToken);
router.post('/collect-sample', labController.collectSample);
router.post('/start-processing', labController.startProcessing);
router.post('/generate-report', labController.generateReport);

module.exports = router;