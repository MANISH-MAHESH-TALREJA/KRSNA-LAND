// LECTURE 01

const express = require("express");
const app = express();
let port = 8000;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public/js"));
app.use(express.static(__dirname + "/public/css"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
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

app.get("/test", (request, response) => {
	const sampleListing = new Listing({
		title: "Beach Villa",
		description: "Beautiful Beach Villa With Forest View",
		price: 1200,
		image: "",
		location: "Goa",
		country: "India"
	});
	sampleListing.save().then((response) => {
		console.log("RECORD SAVED");
	}).catch((error) => {
		console.log(error)
		console.log("FAILED TO SAVE RECORD");
	});
});