const isLoggedIn = (request, response, next) => {
	if (request.isAuthenticated()) {
		return next();
	}
	else {
		request.flash("showToast", "true");
		request.flash("toastMessage", "Kindly login to proceed further...");
		response.redirect(`/login?forward=${request.originalUrl}`);
	}
};

module.exports = isLoggedIn;