const express = require('express')
const viewController = require('./../controllers/viewsController')
const authController = require('./../controllers/authController')


const router = express.Router();

router.use(authController.isLogin)

router.get('/',viewController.getOverview )
router.get('/tour/:slug',viewController.getOneTour)
router.get('/login', viewController.getLoginForm)


module.exports = router;