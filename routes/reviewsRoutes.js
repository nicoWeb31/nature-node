const express = require('express');
const router = express.Router();
const reviewController = require('./../controllers/reviewController');




router.route('/')
.get(reviewController.getAllReviews)
.post(reviewController.newReview)

module.exports = router;