const Joi = require("joi");

const reviewClientSchema = Joi.object({
	review: Joi.object({
		comment: Joi.string().min(3).required(),
		rating: Joi.number().min(1).max(5).required(),
		createdAt: Joi.date().default(Date.now()).allow("", null)
	})
});


module.exports = reviewClientSchema;
