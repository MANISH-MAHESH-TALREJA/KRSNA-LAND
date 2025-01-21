const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const reviewClientSchema = require("../schema/reviewSchema");
const ExpressError = require("../utils/ExpressError");
const {Review} = require("../models/review");
const {Listing} = require("../models/listing");

router.post("/:id", wrapAsync(async (request, response, next) => {
	let { review } = request.body;
	let { id } = request.params;
	let result = reviewClientSchema.validate(request.body);
	if(result.error) {
		throw new ExpressError(400, result.error);
	}
	const userReview = new Review(review);
	await userReview.save();
	await Listing.findByIdAndUpdate(id, { $push : {reviews: userReview} }, {new: true, runValidators: true});
	request.flash("toastMessage", "Review Added Successfully")
	request.flash("showToast", "true")
	response.redirect("/");
}));

router.delete("/:listing/:id", wrapAsync(async (request, response) => {
	let { listing, id } = request.params;
	await Review.findByIdAndDelete(id);
	await Listing.findByIdAndUpdate(listing, { $pull: { reviews: id }}, {new: true, runValidators: true});
	request.flash("toastMessage", "Review Removed Successfully")
	request.flash("showToast", "true")
	response.redirect(`/${listing}`);
}));

module.exports = router;