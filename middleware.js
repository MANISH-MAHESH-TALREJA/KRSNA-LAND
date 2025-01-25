const isLoggedIn = (request, response, next) => {
	console.log(request.user);

	if(request.isAuthenticated()) {
		return next();
	} else {
		//console.log(request);
		request.flash("showToast", "true");
		request.flash("toastMessage", "Kindly login to proceed further...");
		response.redirect(`/login?forward=${request.originalUrl}`);
	}
};



module.exports = isLoggedIn;