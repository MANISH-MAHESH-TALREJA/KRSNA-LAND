const {User} = require("../models/user");
const {Listing} = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
app.get("/demoUser", async (request, response) => {
	let fakeUser = new User({
		name: "Test User",
		email: "MANISHTALREJA189@GMAIL.COM",
		mobile: "9833137409",
		username: "MMT2000",
	});
	const registeredUser = await User.register(fakeUser, "123456");
	response.send(registeredUser);
});

app.get("/flashCookie", (request, response) => {
	response.send(request.flash("hare"));
});
app.get("/getCookie", (request, response) => {
	request.flash("hare", "krishna");
	response.cookie("greet", "hare krishna");
	response.send("We send you the cookie");
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