const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
// const reviewController = require('./../controllers/reviewController')

const reviewRouter = require("./../routes/reviewsRoutes");
//POST /tour/345ERTERT/reviews
//GET /tour/345ERTERT/reviews
//GET /tour/345ERTERT/reviews/lksjflsdkfj345

// router.route('/:tourId/reviews')
// .post(authController.protect,authController.restrictTo('user'),reviewController.createReview)

router.use("/:tourId/reviews", reviewRouter);

const tourController = require("../controllers/controllerTour");

//param middleware
// router.param('id',tourController.checkId)

//create a check body middlewre
//check if body contains the name and price properties
//if not,send the back 400
//stact it tou the post handler stack

router
    .route("/top-5-cheap")
    .get(tourController.aliasTopTour, tourController.getAllTours);
router.route("/tour-stats").get(tourController.getToursStats);
router
    .route("/monthly-plan/:year")
    .get(
        authController.protect,
        authController.restrictTo("admin", "lead-guide", "guide"),
        tourController.getMonthlyPlan
    );

router
    .route("/")
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.checkBody,
        tourController.createNewTour
    );

router
    .route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(tourController.getTourWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
    .route("/:id")
    .get(tourController.getOneTour)
    .delete(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.deleteTour
    )
    .patch(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.uploadTourImage,
        tourController.resizeTourImages,
        tourController.patchTour
    );

module.exports = router;
