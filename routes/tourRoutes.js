const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController')




const tourController = require('../controllers/controllerTour')

//param middleware
// router.param('id',tourController.checkId)

//create a check body middlewre
//check if body contains the name and price properties
//if not,send the back 400
//stact it tou the post handler stack

router.route('/top-5-cheap').get(tourController.aliasTopTour,tourController.getAllTours)
router.route('/tour-stats').get(tourController.getToursStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)


router.route("/")
.get(authController.protect,tourController.getAllTours)
.post(tourController.checkBody,tourController.createNewTour);

router.route("/:id")
.get(tourController.getOneTour)
.delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour)
.patch(tourController.patchTour);


//POST /tour/345ERTERT/reviews
//GET /tour/345ERTERT/reviews
//GET /tour/345ERTERT/reviews/lksjflsdkfj345

router.route('/:tourId/reviews')
.post(authController.protect,authController.restrictTo('user'),reviewController.createReview)

module.exports = router;