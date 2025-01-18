// EXPRESS
const express = require("express");
const router = express.Router();

// REQUIRE UTILS
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

// REQUIRE MODELS
const {Listing} = require("../models/listing");

// REQUIRE LISTING SCHEMA
const listSchema = require("../schema/listingSchema");

// VIEW ALL LISTINGS - HOMEPAGE ROUTE

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

// ADD LISTING PAGE ROUTE
router.get("/add", (request, response) => {
	response.render("add_listing");
});

// ADD LISTING POST ROUTE

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

// EDIT LISTING PAGE ROUTE

router.get("/:id/edit", wrapAsync(async (request, response) => {
	let {id} = request.params;
	let fetchedListing = await Listing.findById(id);
	response.render("edit_listing", {fetchedListing});
}));

// VIEW LISTING DETAILS ROUTE

router.get("/:id", wrapAsync(async (request, response) => {
	response.locals.pageName = "LISTING DETAILS";
	let {id} = request.params;
	let fetchedListing = await Listing.findById(id).populate("reviews");
	response.render("show", {fetchedListing});
}));

// EDIT LISTING PATCH ROUTE

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
		console.log(`${result}`);
		request.flash("toastMessage", "Listing Updated Successfully");
		request.flash("showToast", "true");
		response.redirect("/");
	}).catch((error) => {
		request.flash("toastMessage", error);
		request.flash("showToast", "false");
		response.redirect("/");
	});
}));

// DELETE LISTING ROUTE

router.delete("/:id", wrapAsync(async (request, response) => {
	let {id} = request.params;
	Listing.findByIdAndDelete(id).then((result) => {
		console.log(`${result}`);
		request.flash("toastMessage", "Listing Deleted Successfully");
		request.flash("showToast", "true");
		response.redirect("/");
	}).catch((error) => {
		request.flash("toastMessage", error);
		request.flash("showToast", "false");
		response.redirect("/");
	});
}));

module.exports = router;

