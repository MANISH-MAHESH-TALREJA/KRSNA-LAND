// LECTURE 01

const express = require("express");
const app = express();
let port = 8000;
let methodOverride = require('method-override')
const mongoose = require("mongoose");
const {Listing, listingSchema} = require("./models/listing");
const {Review, reviewSchema} = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public/js"));
app.use(express.static(__dirname + "/public/css"));
app.use(express.static(__dirname + "/public/images"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.locals.pageName = "KRSNA LAND";
app.locals.toastMessage = "";
app.locals.showToast = false;
app.locals.search = "";
const listSchema = require("./schema/listingSchema.js");
const reviewClientSchema = require("./schema/reviewSchema.js");

app.listen(port, () => {
	console.log("APP IS LISTENING TO PORT 8000");
});

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/krsnaland");
}

main().then((response) => {
	console.log("DATABASE CONNECTED");
}).catch((error) => {
	console.log("SOME ERROR OCCURRED");
});

app.use((req, res, next) => {
    if (req.originalUrl === "/favicon.ico") {
        return res.status(204).send();
    }
    next();
});

// I have intentionally created an error here, once this page will be called then error
// will be invoked and the error will look for the next error handling middleware
// and at the last it will go for the last function which will handle it.

// if you want to pass any error to the next error handling middleware then make sure that you include next in the params
// of the (request, response, next)
app.get("/test", (request, response, next) => {
	const sampleListing = new Listing({
		title: "Beach Villa",
		description: "Beautiful Beach Villa With Forest View",
		price: "ABCD",
		image: "",
		location: "Goa",
		country: "India"
	});
	sampleListing.save().then((response) => {
		console.log("RECORD SAVED");
	}).catch((error) => {
		console.log("I AM IN THIS ERROR");
		next(new ExpressError(400, "INVLAID NUMBER"));
		// throw new ExpressError(400, "INVLAID NUMBER");
		// The issue arises because the ExpressError instance you throw inside the .catch() block is not propagated to the next middleware. In Express, the error handling middleware is triggered by passing an error to the next() function, not by simply throwing it.
	});
});

app.get("/", wrapAsync(async (request, response) => {
	const { search } = request.query;
	app.locals.search = search;
	let listings;
	if(search && search.length > 3) {
		listings = await Listing.find({title: {$regex: search, $options: "i"}}).populate("review");
	} else {
		listings = await Listing.find({}).populate("reviews");
	}
	response.render("listing", { listings });
	app.locals.showToast = false;
	app.locals.toastMessage = "";
}));

app.get("/add", (request, response) => {
	let search = "";
	response.render("add_listing");
});

// in this function i have used wrapAsync which using pre-defined try catch and if any error occurs, then the next error
// handling middleware will be called, at last there is only one middleware which will be called which will display
// error message along with error code.
app.post("/", wrapAsync(async (request, response) => {
	let { title, description, image, price, location, country } = request.body;
	let result = listSchema.validate(request.body);
	if(result.error) {
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
	app.locals.toastMessage = "Listing Added Successfully";
	app.locals.showToast = true;
	response.redirect("/");
}));

app.get("/:id/edit", wrapAsync(async (request, response) => {
	let { id } = request.params;
	let fetchedListing = await Listing.findById(id);
	response.render("edit_listing", { fetchedListing });
}));

app.get("/:id", wrapAsync(async (request, response) => {
	app.locals.pageName = "LISTING DETAILS";
	let { id } = request.params;
	let fetchedListing = await Listing.findById(id).populate("reviews");
	response.render("show", { fetchedListing });
	app.locals.toastMessage = "";
	app.locals.showToast = false;
}));


app.patch("/:id", wrapAsync(async (request, response) => {
	let { title, description, image, price, location, country } = request.body;
	let updateData = {title: title, description: description, image: image, price: price, location: location, country: country}
	let { id } = request.params;
	Listing.findByIdAndUpdate(id, { ...updateData}, {new: true, runValidators: true}).then((response) => {
		app.locals.toastMessage = "Listing Updated Successfully";
		app.locals.showToast = true;
	}).catch((error) => {
		app.locals.toastMessage = error;
		app.locals.showToast = false;
	});


	response.redirect("/");
}));

app.delete("/:id", wrapAsync(async (request, response) => {
	let { id } = request.params;
	Listing.findByIdAndDelete(id).then((response) => {
		app.locals.toastMessage = "Listing Deleted Successfully";
		app.locals.showToast = true;
	}).catch((error) => {
		app.locals.toastMessage = error;
		app.locals.showToast = false;
	});
	response.redirect("/");
}));



app.post("/review/:id", wrapAsync(async (request, response, next) => {
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
	app.locals.toastMessage = "Review Added Successfully";
	app.locals.showToast = true;
	response.redirect("/");
}));

app.delete("/review/:listing/:id", wrapAsync(async (request, response) => {
	let { listing, id } = request.params;
	await Review.findByIdAndDelete(id);
	await Listing.findByIdAndUpdate(listing, { $pull: { reviews: id }}, {new: true, runValidators: true});
	app.locals.toastMessage = "Review Removed Successfully";
	app.locals.showToast = true;
	response.redirect(`/${listing}`);
}));

// HERE IS THE ERROR HANDLING MIDDLEWARE THAT WILL HANDLE ALL ERRORS

app.use((err, req, res, next) => {
	console.log("INSIDE THE MIDDLE WARE")
	console.log(err);
	let { status = 500, message = "INTERNAL SERVER ERROR" } = err;
	res.render("error_page.ejs", { statusCode: status, errorText: message});
	// return error to ejs and use err.stack to show full stack trace on ui
	// res.status(status).send(message);
});
