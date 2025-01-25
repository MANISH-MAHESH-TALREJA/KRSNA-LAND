const express = require("express");
const router = express.Router();
const userSchema = require("../schema/userSchema");
const {User} = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const {transporter, getRegisterEmailString, getForgotPasswordString} = require("../utils/emailConfig");

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
	let forward  = request.query.forward || ""
	console.log(forward);
	if(request.user) {
		let goLink = forward || "/";
		response.redirect(goLink);
	}
	response.render("login", {forward});
});

router.get("/register", (request, response) => {

	let { forward } = request.query;
	if(request.user) {
		let goLink = forward || "/";
		response.redirect(goLink);
	}
	response.render("signup", {forward});
});

router.post("/resetPassword", wrapAsync(async (request, response) => {
	let {email} = request.body;
	console.log(request.body);
	console.log(email);
	const resetUser = await User.findOne({username: email});
	console.log(resetUser);
	await sendForgotPasswordMail(resetUser.username, resetUser.id);
	request.flash("showToast", "true");
	request.flash("toastMessage", "Password Reset Mail Sent Successfully");
	response.redirect("/login");
}));

router.get("/resetPassword/:id", (request, response) => {
	let {id} = request.params;
	response.render("change-password.ejs", {id})
});

router.post("/resetPassword/:id", wrapAsync(async (request, response) => {
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
}));

/*router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',         // Redirect on successful login
    failureRedirect: '/login',    // Redirect on failed login
    failureFlash: true,           // Enable flash messages for failure
  })
);*/

router.post('/login', (request, response, next) => {
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
});

/*router.post('/login', (req, res, next) => {
  const redirectUrl = req.query.redirectUrl || '/'; // Get redirect URL from query parameters or default to '/'

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // Handle error
    }
    if (!user) {
      return res.redirect('/login'); // Handle failed login
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err); // Handle error during login
      }
      // Redirect to the provided URL or default to '/'
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
});*/



router.post("/register", wrapAsync(async (request, response) => {
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
}));

router.get("/logout", (request, response, next) => {
	request.logOut((error) => {
		if(error) {
			return next(error);
		}
		request.flash("toastMessage", "Thanks for using HARE KRISHNA LAND. You are successfully logged out");
		request.flash("showToast", "false");
		response.redirect("/login");
	})
});

module.exports = router;