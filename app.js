// PACKAGES REQUIREMENTS
require('dotenv').config();
const express = require("express");
const methodOverride = require('method-override');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");

// PROJECT FILES ROUTES

const listings = require("./routes/listing");
const reviews = require("./routes/reviews");
const users = require("./routes/users");
const { User } = require("./models/user");

// ----------- START INITIALIZE THE EXPRESS APP AND MONGO DB DATABASE

const app = express();
let port = 8000;
app.locals.pageName = "KRSNA LAND";
app.locals.search = "";
app.locals.googleMapsAPIKey = process.env.GOOGLE_MAPS_API_KEY;
app.listen(port, () => {
	console.log(`APP IS LISTENING TO PORT ${port}`);
});

async function main() {
	await mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING);
}

main().then((response) => {
	console.log(`DATABASE CONNECTED - ${response}`);
}).catch((error) => {
	console.log(`SOME ERROR OCCURRED - ${error}`);
});

// MIDDLEWARES

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public/js"));
app.use(express.static(__dirname + "/public/css"));
app.use(express.static(__dirname + "/public/images"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.use(cookieParser());
app.use(flash());
app.use(session({
		secret: "TEST#9833137409",
		resave: false,
		saveUninitialized: true,
		cookie: {
			expires: Date.now() * 7 * 24 * 60 * 60 * 1000, // DAYS * HOURS * EACH HOUR MINUTES * EACH MINUTE SECONDS * EACH SECOND MILLISECONDS
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		}
	}
));
app.use(passport.initialize());
// noinspection JSCheckFunctionSignatures
app.use(passport.session());

// HANDLE FLASH MESSAGES - MIDDLEWARE
app.use((request, response, next) => {
	// noinspection JSUnresolvedReference
	response.locals.showToast = request.flash("showToast");
	// noinspection JSUnresolvedReference
	response.locals.toastMessage = request.flash("toastMessage");
	next();
});

app.locals.loggedInUser = null;
app.locals.latitude = "19.2856";
app.locals.longitude = "72.8691"

// HANDLE FAVICON ISSUE - MIDDLEWARE
app.use((request, response, next) => {
	if(request.user) {
		app.locals.loggedInUser = request.user;
	} else {
		app.locals.loggedInUser = null;
	}
	if (request.originalUrl === "/favicon.ico") {
		return response.status(204).send();
	}
	next();
});

// USE THE ROUTES
app.use("/", users);
app.use("/review", reviews);
app.use("/", listings);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((error) => done(error, null));
});


// HERE IS THE ERROR HANDLING MIDDLEWARE THAT WILL HANDLE ALL ERRORS

app.use((error, request, response, next) => {
	console.log(`ERROR HANDLING MIDDLEWARE - ${error}`);
	console.log(`ERROR HANDLING MIDDLEWARE - ${request.user}`);
	let {status = 500, message = "INTERNAL SERVER ERROR"} = error;
	// noinspection JSUnresolvedReference
	response.render("pages/error-page.ejs", {statusCode: status, errorText: message});
	// return error to ejs and use err.stack to show full stack trace on ui
	// res.status(status).send(message);
});


