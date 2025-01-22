const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userSchema = require("../schema/userSchema");
const {User} = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const nodemailer = require("nodemailer");
const {transporter, getRegisterEmailString, getForgotPasswordString } = require("../utils/emailConfig");

async function sendRegisterMail(email) {
	const info = await transporter.sendMail({
		from: '"Hare krishna" <iskcon@yourdigitallift.com>',
		to: email,
		subject: "Reset password For Hare Krishna Land ✔",
		text: "Reset Your Password For Hare Krishna Land",
		html: getRegisterEmailString(email),
	});
	console.log("Message sent: %s", info.messageId);
}

async function sendForgotPasswordMail(email, salt) {
	const info = await transporter.sendMail({
		from: '"Hare krishna" <iskcon@yourdigitallift.com>',
		to: email,
		subject: "Welcome To Hare Krishna Land ✔",
		text: "Thanks for registering with Hare Krishna Land (ISKCON)",
		html: getForgotPasswordString(email, salt),
	});
	console.log("Message sent: %s", info.messageId);
}

router.get("/login", (request, response) => {
	response.render("login");
});

router.get("/register", (request, response) => {
	response.render("signup");
});

router.post("/resetPassword", wrapAsync(async (request, response) => {
	let { email } = request.body;
	console.log(request.body);
	console.log(email);
	const resetUser = await User.findOne({ username: email});
	console.log(resetUser);
	sendForgotPasswordMail(resetUser.username, resetUser.id);
	request.flash("showToast", "true");
	request.flash("toastMessage", "Password Reset Mail Sent Successfully");
	response.redirect("/login");
}));

router.get("/resetPassword/:id", (request, response) => {
	let { id } = request.params;
	response.render("change-password.ejs", { id })
});

router.post("/resetPassword/:id", wrapAsync(async (request, response) => {
	let { id } = request.params;
	const {password, confirmPassword } = request.body;
	if(password !== confirmPassword) {
		request.flash("showToast", "false");
		request.flash("toastMessage", "BOTH THE PASSWORDS DO NOT MATCH");
		response.redirect(`/resetPassword/${id}`);
	} else {
		const resetUser = await User.findById(id);
		await resetUser.setPassword(password);
		await resetUser.save();
		request.flash("showToast", "alert");
		request.flash("toastMessage", "PASSWORD RESET SUCCESSFULLY.");
		response.redirect("/login");
	}
}));

router.post("/login", (request, response) => {
	const {username, password} = request.body;
	console.log(username);
	console.log(password);
	console.log(request.body);
	if (username && password) {
		User.authenticate()(username, password, function (error, result) {
			if (error) {
				console.log("Error:", error);
				console.log("User failed verification");
				return response.redirect("/login");
			}
			else {
				if (result) {
					console.log("Authentication result:", result);
					console.log("User passed verification");
					return response.redirect("/");
				}
				else {
					request.flash("showToast", "alert");
					request.flash("toastMessage", "Invalid Login");
					return response.redirect("/login");
				}
			}
		});
	}
	else {
		request.flash("showToast", "alert");
		request.flash("toastMessage", "Enter Valid Email & Password");
		response.redirect("/login");
	}
});

router.post("/register", wrapAsync(async (request, response) => {
	const result = userSchema.validate(request.body)
	if (result.error) {
		request.flash("showToast", "alert");
		request.flash("toastMessage", result.error.message);
		response.redirect("/register");
	}
	else {
		const newUser = new User(request.body.user);
		User.register(newUser, request.body.user.password).then((result) => {
			console.log(result);
			sendRegisterMail(result.username).catch(console.error);
			request.flash("showToast", "alert");
			request.flash("toastMessage", "Thanks, For Your Registration. Kindly Login To Enjoy Our Services");
			response.redirect("/login");
		}).catch((error) => {
			request.flash("showToast", "alert");
			request.flash("toastMessage", error.message);
			response.redirect("/register");
		});
	}
}));

module.exports = router;