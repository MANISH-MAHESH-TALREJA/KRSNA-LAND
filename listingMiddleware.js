const {Listing} = require("./models/listing");
const checkListingOwnership = async (request, response, next) => {
	console.log("I AM INSIDE LISTING CHECK MIDDLEWARE");
	console.log(request.params);
	let {id} = request.params;
	console.log(id);
	console.log(request.user.id);
	if (request.user.isAdmin) {
		return next();
	}
	else {
		const myListing = await Listing.findById(id);
		console.log(myListing);
		if (myListing && myListing.createdBy) {
			if (request.user.id === myListing.createdBy.id) {
				console.log("INSIDE ME CHECK MID");
				return next();
			}
			else {
				request.flash("toastMessage", "YOU ARE NOT AUTHORIZED TO PERFORM ACTION ON THE LISTING");
				request.flash("showToast", "alert");
				response.redirect("/");
			}
		}
		else {
			request.flash("toastMessage", "LISTING IS ANONYMOUS.");
			request.flash("showToast", "alert");
			response.redirect("/");
		}
	}


};

module.exports = checkListingOwnership;