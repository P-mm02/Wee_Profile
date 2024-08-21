const Joi = require('joi');

module.exports.ProjectCardSchema = Joi.object({
    projectCard: Joi.object({
        projectName: Joi.string().required(),
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
        projecthref: Joi.string().required()
    }).required()
});

module.exports.ReviewSchema = Joi.object({
    reviews: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        review: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
});