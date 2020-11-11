const express = require('express');
const router = express.Router();



const tourController = require('../controllers/controllerTour')

//param middleware
router.param('id',tourController.checkId)

//create a check body middlewre
//check if body contains the name and price properties
//if not,send the back 400
//stact it tou the post handler stack


router.route("/")
.get(tourController.getAllTours)
.post(tourController.checkBody,tourController.createNewTour);

router.route("/:id")
.get(tourController.getOneTour)
.delete(tourController.deleteTour)
.patch(tourController.patchTour);

module.exports = router;