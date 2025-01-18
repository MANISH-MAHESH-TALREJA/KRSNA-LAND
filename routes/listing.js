const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const {Listing} = require("../models/listing");
const {Review} = require("../models/review");
const listSchema = require("../schema/listingSchema");
const ExpressError = require("../utils/ExpressError");
const router = express.Router();

router.get("/", wrapAsync(async (request, response) => {
	const {search} = request.query;
	response.locals.search = search;
	let listings;
	if (search && search.length > 3) {
		listings = await Listing.find({title: {$regex: search, $options: "i"}}).populate("reviews");
	}
	else {
		listings = await Listing.find({}).populate("reviews");
	}
	response.render("listing", {listings});
}));

router.get("/add", (request, response) => {
	let search = "";
	response.render("add_listing");
});

// in this function I have used wrapAsync which using pre-defined try catch and if any error occurs, then the next error
// handling middleware will be called, at last there is only one middleware which will be called which will display
// error message along with error code.
router.post("/", wrapAsync(async (request, response) => {
	let {title, description, image, price, location, country} = request.body;
	let result = listSchema.validate(request.body);
	if (result.error) {
		throw new ExpressError(400, result.error);
	}
	const newListing = new Listing({
		title: title,
		description: description,
		image: image,
		price: price,
		location: location,
		country: country
	});
	await newListing.save();
	request.flash("toastMessage", "Listing Added Successfully")
	request.flash("showToast", "true")
	response.redirect("/");
}));

router.get("/:id/edit", wrapAsync(async (request, response) => {
	let {id} = request.params;
	let fetchedListing = await Listing.findById(id);
	response.render("edit_listing", {fetchedListing});
}));

router.get("/:id", wrapAsync(async (request, response) => {
	response.locals.pageName = "LISTING DETAILS";
	let {id} = request.params;
	let fetchedListing = await Listing.findById(id).populate("reviews");
	response.render("show", {fetchedListing});
}));


router.patch("/:id", wrapAsync(async (request, response) => {
	let {title, description, image, price, location, country} = request.body;
	let updateData = {
		title: title,
		description: description,
		image: image,
		price: price,
		location: location,
		country: country
	}
	let {id} = request.params;
	Listing.findByIdAndUpdate(id, {...updateData}, {new: true, runValidators: true}).then((result) => {
		request.flash("toastMessage", "Listing Updated Successfully")
		request.flash("showToast", "true")
		response.redirect("/");
	}).catch((error) => {
		request.flash("toastMessage", error)
		request.flash("showToast", "false")
		response.redirect("/");
	});
}));

router.delete("/:id", wrapAsync(async (request, response) => {
	let {id} = request.params;
	Listing.findByIdAndDelete(id).then((result) => {
		request.flash("toastMessage", "Listing Deleted Successfully")
		request.flash("showToast", "true")
		response.redirect("/");
	}).catch((error) => {
		request.flash("toastMessage", error)
		request.flash("showToast", "false")
		response.redirect("/");
	});
}));

module.exports = router;

