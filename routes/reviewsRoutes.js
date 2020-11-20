const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({
    mergeParams: true//permet d'avoir acces au param des autres route
});

//router.use('/tour/:tourId/reviews/', reviewRouter)

router.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect,authController.restrictTo('user'),reviewController.createReview)


router.route('/:id')
.delete(reviewController.deleteReview)
.patch(reviewController.updateReview)
module.exports = router;