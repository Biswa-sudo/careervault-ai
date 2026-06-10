const Joi = require('joi');

const createResumeSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).required(),
  templateId: Joi.string().trim().max(100).default('default'),
  resumeData: Joi.object().required()
});

const updateResumeSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255),
  templateId: Joi.string().trim().max(100),
  resumeData: Joi.object()
}).min(1);

module.exports = {
  createResumeSchema,
  updateResumeSchema
};