const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 5
	},
	mobile: {
		required: true,
		type: String,
		minLength: 10,
		maxLength: 10,
		unique: true,
	},
	username: {
		required: true,
		type: String,
		minLength: 5,
		unique: true
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
	/*username: {
		required: true,
		type: String,
		minLength: 5,
	},
	password: {
		type: String,
		required: true,
		minLength: 10,
	},*/
});

// We are using this as username, salt and password are managed by passport local mongoose,
// so we need to embed all the extra fields and the username and password field will be embedded by
// passport local mongoose itself along with many login and register methods.

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("user", userSchema);

module.exports = {
	User, userSchema
}