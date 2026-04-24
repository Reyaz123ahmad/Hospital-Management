// // src/routes/paymentRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const paymentController = require('../controllers/paymentController');

// router.use(protect);

// router.post('/create-order', paymentController.createOrder);
// router.post('/verify', paymentController.verifyPayment);
// router.get('/history', paymentController.getPaymentHistory);
// router.get('/invoice/:id', paymentController.downloadInvoice);

// module.exports = router;


// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Protected routes (require login)
router.use(protect);

// Payment endpoints
router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.get('/status/:appointmentId', paymentController.getPaymentStatus);
router.get('/history', paymentController.getPaymentHistory);
router.post('/refund', authorize('admin'), paymentController.refundPayment);
router.get('/details/:paymentId', authorize('admin'), paymentController.getPaymentDetails);

// Webhook (no auth - called by Razorpay)
// This route should be added in app.js separately

module.exports = router;