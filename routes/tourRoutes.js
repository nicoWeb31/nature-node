const express = require('express');
const router = express.Router();



const tourController = require('../controllers/controllerTour')

router.route("/")
.get(tourController.getAllTours)
.post(tourController.createNewTour);

router.route("/:id")
.get(tourController.getOneTour)
.delete(tourController.deleteTour)
.patch(tourController.patchTour);

module.exports = router;