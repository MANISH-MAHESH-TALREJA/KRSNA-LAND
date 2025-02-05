const wrapAsync = require("../utils/wrapAsync");
const {Listing} = require("../models/listing");
const listSchema = require("../schema/listingSchema");
const ExpressError = require("../utils/ExpressError");
const path = require("path");
const {s3, getS3Params} = require("../utils/amazonS3Config");

module.exports.indexPage = wrapAsync(async (request, response) => {
    let { search, sort, direction = "ASC", page = 1 } = request.query;
    console.log(request.query);

    const limit = 8;
    const skip = (page - 1) * limit;

    // Search filter
    const query = search && search.length > 3 ? { title: { $regex: search, $options: "i" } } : {};

    // Sorting logic
    const sortDir = direction === "DESC" ? -1 : 1;
    let sortObject = {};

    if (sort === "rating") {
        sortObject = { reviewsCount: sortDir }; // Custom field for sorting
    } else if (sort === "relevance") {
        sortObject = { createdAt: sortDir };
    } else if (sort === "price") {
        sortObject = { price: sortDir };
    }

    // Aggregation Pipeline
    const listings = await Listing.aggregate([
        { $match: query }, // Filter by search query
        { $lookup: { from: "reviews", localField: "reviews", foreignField: "_id", as: "reviewsData" } }, // Populate reviews
        { $addFields: { reviewsCount: { $size: "$reviewsData" } } }, // Count reviews
        { $sort: sortObject }, // Sort dynamically
        { $skip: skip },
        { $limit: limit }
    ]);

    // Get total listings count for pagination
    const totalItems = await Listing.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    // Render the page with listings and query params
    response.render("pages/listing", {
        listings,
        page: parseInt(page),
        totalPages,
        search,
        queryParams: request.query
    });
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
	if (fetchedListing.geometry) {
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