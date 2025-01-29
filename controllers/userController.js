const wrapAsync = require("../utils/wrapAsync");
const {User} = require("../models/user");
const passport = require("passport");
const {sendRegisterMail, sendForgotPasswordMail} = require("../utils/emailConfig");
const userSchema = require("../schema/userSchema");



module.exports.loginPage = (request, response) => {
	let forward  = request.query.forward || ""
	console.log(forward);
	if(request.user) {
		let goLink = forward || "/";
		response.redirect(goLink);
	}
	response.render("pages/login", {forward});
};

module.exports.registerPage = (request, response) => {
	let { forward } = request.query;
	if(request.user) {
		let goLink = forward || "/";
		response.redirect(goLink);
	}
	response.render("pages/signup", {forward});
};

module.exports.sendResetPasswordEmail = wrapAsync(async (request, response) => {
	let {email} = request.body;
	console.log(request.body);
	console.log(email);
	const resetUser = await User.findOne({username: email});
	console.log(resetUser);
	await sendForgotPasswordMail(resetUser.username, resetUser.id);
	request.flash("showToast", "true");
	request.flash("toastMessage", "Password Reset Mail Sent Successfully");
	response.redirect("/login");
});

module.exports.resetPasswordPage = (request, response) => {
	let {id} = request.params;
	response.render("pages/change-password.ejs", {id})
};

module.exports.resetPassword = wrapAsync(async (request, response) => {
	let {id} = request.params;
	const {password, confirmPassword} = request.body;
	if (password !== confirmPassword) {
		request.flash("showToast", "false");
		request.flash("toastMessage", "BOTH THE PASSWORDS DO NOT MATCH");
		response.redirect(`/resetPassword/${id}`);
	}
	else {
		const resetUser = await User.findById(id);
		await resetUser.setPassword(password);
		await resetUser.save();
		request.flash("showToast", "alert");
		request.flash("toastMessage", "PASSWORD RESET SUCCESSFULLY.");
		response.redirect("/login");
	}
});

module.exports.login = (request, response, next) => {
	console.log(request.query)
	const originalUrl = request.query.forward || '/';
	passport.authenticate('local', (error, user, info) => {
		if(error) {
			return next(error);
		}
		if(!user) {
			return response.redirect("/login");
		}
		request.logIn(user, (error) => {
			if(error) {
				return next(error);
			}
			return response.redirect(originalUrl);
		})
	}) (request, response, next);
};

module.exports.register = wrapAsync(async (request, response) => {
	let forward  = request.query.forward || "" ;
	let loginLink = "/login", registerLink = "/register";
	if(forward) {
		loginLink += `?forward=${forward}`;
		registerLink += `?forward=${forward}`;
	}
	const result = userSchema.validate(request.body)
	if (result.error) {
		request.flash("showToast", "alert");
		request.flash("toastMessage", result.error.message);
		response.redirect(registerLink);
	}
	else {
		const newUser = new User(request.body.user);
		User.register(newUser, request.body.user.password).then((result) => {
			console.log(result);
			sendRegisterMail(result.username).catch(console.error);
			request.flash("showToast", "alert");
			request.flash("toastMessage", "Thanks, For Your Registration. Kindly Login To Enjoy Our Services");
			response.redirect(loginLink);
		}).catch((error) => {
			request.flash("showToast", "alert");
			request.flash("toastMessage", error.message);
			response.redirect(registerLink);
		});
	}
});

module.exports.logoutUser = (request, response, next) => {
	request.logOut((error) => {
		if(error) {
			return next(error);
		}
		request.flash("toastMessage", "Thanks for using HARE KRISHNA LAND. You are successfully logged out");
		request.flash("showToast", "false");
		response.redirect("/login");
	})
};