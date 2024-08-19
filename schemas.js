const Joi = require('joi');

module.exports.ProjectCardSchema = Joi.object({
    projectCard: Joi.object({
        projectName: Joi.string().required(),
        projectYear: Joi.string().required(),
        projecthref: Joi.string().required()
    }).required()
});