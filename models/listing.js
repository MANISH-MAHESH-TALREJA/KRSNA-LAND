const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema({
	title: {
		required: true,
		maxLength: 100,
		type: String,
	},
	description: {
		type: String
	},
	image: {
		type: String,
		default: "https://images.unsplash.com/photo-1643266421634-467f26f84b56?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		set: (v) => v === "" ? "https://images.unsplash.com/photo-1643266421634-467f26f84b56?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
	},
	price: {
		type: Number,
		required: true,
		default: 100,
	},
	location: {
		type: String,
		required: true,
	},
	country: {
		type: String,
	}
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;