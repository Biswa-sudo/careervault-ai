const Joi = require('joi');
const { isValidNormalizedPhoneNumber, normalizePhoneNumber } = require('../../utils/phone');

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  phoneNumber: Joi.string()
    .trim()
    .custom((value, helpers) => {
      const normalized = normalizePhoneNumber(value);
      if (!isValidNormalizedPhoneNumber(normalized)) {
        return helpers.error('string.pattern.name', { name: 'phone number' });
      }
      return normalized;
    }, 'phone normalization')
    .required(),
  email: Joi.string().trim().lowercase().email().max(191).allow('', null)
});

module.exports = {
  updateProfileSchema
};
