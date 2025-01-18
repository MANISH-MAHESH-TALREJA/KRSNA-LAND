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
const session = require("express-session");
const listings = require("./routes/listing");
const reviews = require("./routes/reviews");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

app.use(cookieParser());
app.use(flash());

const sessionOptions = session({
		secret: "MANISH#9833137409",
		resave: false,
		saveUninitialized: true,
		cookie: {
			expires: Date.now() * 7 * 24 * 60 * 60 * 1000, // DAYS * HOURS * EACH HOUR MINUTES * EACH MINUTE SECONDS * EACH SECOND MILLISECONDS
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		}
	}
);

app.use(sessionOptions);

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

app.use((request, response, next) => {
	response.locals.showToast = request.flash("showToast");
	response.locals.toastMessage = request.flash("toastMessage");
	next();
});

app.use((req, res, next) => {
	if (req.originalUrl === "/favicon.ico") {
		return res.status(204).send();
	}
	next();
});

app.get("/manish", (request, response) => {
	response.send(request.flash("hare"));
});
app.get("/getCookie", (request, response) => {
	request.flash("hare", "krishna");
	response.cookie("greet", "hare krishna");
	response.send("We send you the cookie");
});

app.use("/review", reviews);
app.use("/", listings);

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


// HERE IS THE ERROR HANDLING MIDDLEWARE THAT WILL HANDLE ALL ERRORS

app.use((err, req, res, next) => {
	console.log("INSIDE THE MIDDLE WARE")
	console.log(err);
	let {status = 500, message = "INTERNAL SERVER ERROR"} = err;
	res.render("error_page.ejs", {statusCode: status, errorText: message});
	// return error to ejs and use err.stack to show full stack trace on ui
	// res.status(status).send(message);
});


