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

	/*if(review.createdAt === null || review.createdAt === undefined || review.createdAt === '') {
		review.createdAt = Date.now();
	}*/

	// USE THIS APPROACH IF YOU HAVE EMBEDDED REVIEW DOCUMENT INSIDE THE LISTING DOCUMENT IN CASE OF ONE TO MANY (ONE TO FEW)
	// await Listing.findByIdAndUpdate(id, { $push : {reviews: review} }, {new: true, runValidators: true});
	// USE THIS APPROACH IF YOU HAVE EMBEDDED REVIEW DOCUMENT INSIDE THE LISTING DOCUMENT IN CASE OF ONE TO MANY (APPROACH 02)
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