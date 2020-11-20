const express = require("express");
const router = express.Router();
const userController = require("./../controllers/controllerUser");
const authController = require("./../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassord/:token", authController.resetPassword);

router.patch(
    "/updateMyPassword",
    authController.protect,
    authController.upadtePassword
);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router.get(
    "/me",
    authController.protect,
    userController.getMe,
    userController.getOneUser
);

router
    .route("/")
    .get(userController.getAllUsuers)
    .post(userController.createUsers);

router
    .route("/:id")
    .get(userController.getOneUser)
    .patch(userController.patchUser)
    .delete(userController.deleteUser);

module.exports = router;
