const express = require("express");
const router = express.Router();
const userController = require("./../controllers/controllerUser");
const authController = require("./../controllers/authController");



router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassord/:token", authController.resetPassword);





//middleware run in frenquence
//si je met une protect route ici toute les routes apres seront proteger
//ici jusqu'en bas
router.use(authController.protect); //middlware protect

router.patch("/updateMyPassword", authController.upadtePassword);
router.patch("/updateMe",userController.uploadMulter,userController.resizePhoto,userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router.get(
    "/me",
    userController.getMe,
    userController.getOneUser
);


//use middleware to restrictTo toute les routes apres seront accessible que par l'admin
router.use(authController.restrictTo('admin'))

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
