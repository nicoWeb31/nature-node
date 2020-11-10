const express = require('express')
const router = express.Router();
const userController = require('./../controllers/controllerUser');

router.route("/")
    .get(userController.getAllUsuers)
    .post(userController.createUsers);

    router.route("/:id")
    .get(userController.getOneUser)
    .patch(userController.patchUser)
    .delete(userController.deleteUser);


    module.exports  = router;