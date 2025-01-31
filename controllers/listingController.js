const wrapAsync = require("../utils/wrapAsync");
const {Listing} = require("../models/listing");
const listSchema = require("../schema/listingSchema");
const ExpressError = require("../utils/ExpressError");
const path = require("path");
const {s3, getS3Params} = require("../utils/amazonS3Config");

module.exports.indexPage = wrapAsync(async (request, response) => {
	const {search} = request.query;
	response.locals.search = search;
	let listings;
	if (search && search.length > 3) {
		listings = await Listing.find({title: {$regex: search, $options: "i"}}).populate("reviews");
	}
	else {
		listings = await Listing.find({}).populate("reviews");
	}
	response.render("pages/listing", {listings});
});

module.exports.addListingPage = (request, response) => {
	response.render("pages/add-listing");
};

module.exports.addListing = wrapAsync(async (request, response) => {
	console.log(request.body)
	let image = "";
	if (request.file) {
		const fileName = `${Date.now()}_${path.basename(request.file.originalname)}`;
		const data = await s3.upload(getS3Params(fileName, request.file.buffer, request.file.mimeType)).promise();
		image = data.Location;
	}
	let {title, description, price, country, coordinates} = request.body;

	try {
		coordinates = JSON.parse(coordinates);
	}
	catch (error) {
		request.flash("toastMessage", "FAILED TO PARSE COORDINATES")
		request.flash("showToast", "false")
		return response.redirect("/add");
	}
	let result = listSchema.validate({
		title, description, image, price, country, coordinates
	});
	if (result.error) {
		throw new ExpressError(400, result.error);
	}
	const newListing = new Listing({
		title: title,
		description: description,
		image: image,
		price: price,
		location: coordinates.name,
		geometry: {
			latitude: coordinates.latitude,
			longitude: coordinates.longitude,
		},
		country: country,
		createdBy: request.user,
	});
	await newListing.save();
	request.flash("toastMessage", "Listing Added Successfully")
	request.flash("showToast", "true")
	response.redirect("/");
});

module.exports.editListingPage = wrapAsync(async (request, response) => {
	let {id} = request.params;
	let fetchedListing = await Listing.findById(id);
	response.render("pages/edit-listing", {fetchedListing});
});

module.exports.listingDetailPage = wrapAsync(async (request, response) => {
	response.locals.pageName = "LISTING DETAILS";
	let {id} = request.params;
	let fetchedListing = await Listing.findById(id).populate("reviews");
	console.log(fetchedListing);
	if(fetchedListing.geometry) {
		response.locals.latitude = fetchedListing.geometry.latitude;
		response.locals.longitude = fetchedListing.geometry.longitude;
		console.log(response.locals.latitude)
		console.log(response.locals.longitude)
	}
	response.render("pages/show", {fetchedListing});
});

module.exports.updateListing = wrapAsync(async (request, response) => {
	let image = "";
	if (request.file) {
		const fileName = `${Date.now()}_${path.basename(request.file.originalname)}`;
		const data = await s3.upload(getS3Params(fileName, request.file.buffer, request.file.mimeType)).promise();
		image = data.Location;
	}
	let {title, description, price, location, country} = request.body;
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
});

module.exports.deleteListing = wrapAsync(async (request, response) => {
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
});