const Joi = require('joi');

const listSchema = Joi.object({
		title: Joi.string().required().min(3),
		description: Joi.string().required().min(10),
		price: Joi.number().min(0).max(10000).required(),
		coordinates: Joi.object({
			name: Joi.string().required(),
			latitude: Joi.number().required(),
			longitude: Joi.number().required(),
		}),
		country: Joi.string().required(),
		image: Joi.string().allow("", null)
});

module.exports = listSchema;