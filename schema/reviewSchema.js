const Joi = require("joi");

module.exports.reviewClientSchema = Joi.object({
	review: Joi.object({
		comment: Joi.string().min(3).required(),
		rating: Joi.number().min(1).max(5).required(),
		createdAt: Joi.date().allow("", null)
	})
});

