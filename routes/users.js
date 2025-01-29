const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/login")
	.get(userController.loginPage)
	.post(userController.login);

router.route("/register")
	.get(userController.registerPage)
	.post(userController.register);

router.route("/resetPassword/:id")
	.get(userController.resetPasswordPage)
	.post(userController.resetPassword);

router.get("/logout", userController.logoutUser);
router.post("/sendResetPasswordEmail", userController.sendResetPasswordEmail);

module.exports = router;