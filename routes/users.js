const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/login", userController.loginPage);
router.get("/register", userController.registerPage);
router.get("/resetPassword/:id", userController.resetPasswordPage);
router.get("/logout", userController.logoutUser);
router.post("/sendResetPasswordEmail", userController.sendResetPasswordEmail);
router.post("/resetPassword/:id", userController.resetPassword);
router.post('/login', userController.login);
router.post("/register", userController.register);

module.exports = router;