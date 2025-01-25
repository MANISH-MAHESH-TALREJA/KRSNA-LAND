const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const reviewClientSchema = require("../schema/reviewSchema");
const ExpressError = require("../utils/ExpressError");
const {Review} = require("../models/review");
const {Listing} = require("../models/listing");
const isLoggedIn = require("../middleware");

router.post("/:id", isLoggedIn, wrapAsync(async (request, response, next) => {
	let { review } = request.body;
	let { id } = request.params;
	let result = reviewClientSchema.validate(request.body);
	if(result.error) {
		throw new ExpressError(400, result.error);
	}
	const userReview = new Review(review);
	userReview.addedBy = request.user;
	await userReview.save();
	await Listing.findByIdAndUpdate(id, { $push : {reviews: userReview} }, {new: true, runValidators: true});
	request.flash("toastMessage", "Review Added Successfully")
	request.flash("showToast", "true")
	response.redirect("/");
}));

router.delete("/:listing/:id", isLoggedIn, wrapAsync(async (request, response) => {
	let { listing, id } = request.params;
	await Review.findByIdAndDelete(id);
	await Listing.findByIdAndUpdate(listing, { $pull: { reviews: id }}, {new: true, runValidators: true});
	request.flash("toastMessage", "Review Removed Successfully")
	request.flash("showToast", "true")
	response.redirect(`/${listing}`);
}));

module.exports = router;