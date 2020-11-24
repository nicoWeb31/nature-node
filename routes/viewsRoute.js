const express = require('express')
const viewController = require('./../controllers/viewsController')


const router = express.Router();


router.get('/',viewController.getOverview )

router.get('/tour',viewController.getOneTour)


module.exports = router;