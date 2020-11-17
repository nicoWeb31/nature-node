const express = require('express')
const router = express.Router();
const userController = require('./../controllers/controllerUser');
const authController = require('./../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPasswort', authController.forgotPassword);
router.patch('/resetPassord/:token', authController.resetPassword);


router.route("/")
    .get(userController.getAllUsuers)
    .post(userController.createUsers);

    router.route("/:id")
    .get(userController.getOneUser)
    .patch(userController.patchUser)
    .delete(userController.deleteUser);


    module.exports  = router;