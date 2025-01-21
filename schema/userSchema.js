const Joi = require("joi");

const userSchema = Joi.object({
	user: Joi.object({
		name: Joi.string().required(),
		mobile: Joi.string().required().min(7).max(10),
		username: Joi.string().required().email(),
		password: Joi.string().required().min(6)
	})
});

module.exports = userSchema;