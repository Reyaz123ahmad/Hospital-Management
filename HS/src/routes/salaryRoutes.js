const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const salaryController = require('../controllers/salaryController');

router.use(protect);

// Staff/Doctor routes
router.get('/my-salary', salaryController.getMySalary);
router.get('/my-leave-balance', salaryController.getLeaveBalance);
router.post('/leave/apply', salaryController.applyLeave);

module.exports = router;