const mongoose = require("mongoose");
const { data } = require("./data");
const Listing = require("../models/listing");

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/krsnaland");
}

main().then(async (response) => {
	console.log("DATABASE CONNECTED");
	await Listing.deleteMany({});
	Listing.insertMany(data).then((response) => {
		console.log("MANY RECORDS INSERTED");
	}).catch((error) => {
		console.log(error);
		console.log("NO RECORDS INSERTED");
	});
}).catch((error) => {
	console.log("SOME ERROR OCCURRED");
});



