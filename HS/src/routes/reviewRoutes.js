// src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

router.use(protect);

router.post('/', reviewController.addReview);
router.get('/doctor/:doctorId', reviewController.getDoctorReviews);
router.get('/my', reviewController.getMyReviews);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;