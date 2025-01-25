const mongoose = require("mongoose");
const {userSchema} = require("./user");

const reviewSchema = new mongoose.Schema({
	comment: {
		type: String,
		min: 3,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	addedBy: {
		type: userSchema,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		set: (dates) => (dates === null || dates === undefined || dates === "") ? Date.now() : dates
	}
});

const Review = mongoose.model("review", reviewSchema);

module.exports = {
	Review,
	reviewSchema
};