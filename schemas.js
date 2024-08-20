const Joi = require('joi');

module.exports.ProjectCardSchema = Joi.object({
    projectCard: Joi.object({
        projectName: Joi.string().required(),
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
        projecthref: Joi.string().required()
    }).required()
});