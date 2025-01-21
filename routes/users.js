const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userSchema = require("../schema/userSchema");
const {User} = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const nodemailer = require("nodemailer");
const {transporter, getRegisterEmailString} = require("../utils/emailConfig");

function isEmpty(obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

router.get("/login", (request, response) => {
	response.render("login");
});

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
		});

	}
	else {
		request.flash("showToast", "alert");
		request.flash("toastMessage", "Enter Valid Email & Password");
		response.redirect("/login");
	}
});


router.get("/register", (request, response) => {
	response.render("signup");
});


async function sendRegisterMail(email) {
	const info = await transporter.sendMail({
		from: '"Hare krishna" <iskcon@yourdigitallift.com>',
		to: email,
		subject: "Welcome To Hare Krishna Land ✔",
		text: "Thanks for registering with Hare Krishna Land (ISKCON)",
		html: getRegisterEmailString(email),
	});

	console.log("Message sent: %s", info.messageId);
}

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