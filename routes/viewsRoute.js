const express = require('express')
const viewController = require('./../controllers/viewsController')


const router = express.Router();

router.get("/",viewController.homePage );

router.get('/overview',viewController.getOverview )

router.get('/tour',viewController.getOneTour)


module.exports = router;