const {Listing} = require("../models/listing");
const checkListingOwnership = async (request, response, next) => {
	let {id} = request.params;
	if (request.user.isAdmin) {
		return next();
	}
	else {
		const myListing = await Listing.findById(id);
		if (myListing && myListing.createdBy) {
			if (request.user.id === myListing.createdBy.id) {
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