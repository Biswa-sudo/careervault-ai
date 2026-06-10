const Joi = require('joi');
const { isValidNormalizedPhoneNumber, normalizePhoneNumber } = require('../../utils/phone');

const passwordRules = Joi.string()
  .min(8)
  .max(72)
  .pattern(/[a-z]/, 'lowercase letter')
  .pattern(/[A-Z]/, 'uppercase letter')
  .pattern(/[0-9]/, 'number')
  .required();

const phoneRules = Joi.string()
  .trim()
  .custom((value, helpers) => {
    const normalized = normalizePhoneNumber(value);
    if (!isValidNormalizedPhoneNumber(normalized)) {
      return helpers.error('string.pattern.name', { name: 'phone number' });
    }
    return normalized;
  }, 'phone normalization')
  .required();

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  phoneNumber: phoneRules,
  email: Joi.string().trim().lowercase().email().max(191).allow('', null),
  password: passwordRules,
  confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
    'any.only': 'confirmPassword must match password'
  })
});

const loginSchema = Joi.object({
  phoneNumber: phoneRules,
  password: Joi.string().max(72).required()
});

const forgotPasswordSchema = Joi.object({
  phoneNumber: phoneRules
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().hex().length(64).required(),
  password: passwordRules,
  confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
    'any.only': 'confirmPassword must match password'
  })
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};
