const asyncHandler = require('../../utils/asyncHandler');
const AppError = require('../../utils/AppError');
const { normalizePhoneNumber } = require('../../utils/phone');
const userModel = require('./user.model');
const { serializeUser } = require('./user.serializer');

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: serializeUser(req.user)
    }
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const phoneNumber = normalizePhoneNumber(req.body.phoneNumber);
  const email = req.body.email ? req.body.email.toLowerCase() : null;

  const existingPhoneUser = await userModel.findByPhoneNumber(phoneNumber);
  if (existingPhoneUser && existingPhoneUser.id !== req.user.id) {
    throw new AppError('An account already exists for this phone number', 409);
  }

  if (email) {
    const existingEmailUser = await userModel.findByEmail(email);
    if (existingEmailUser && existingEmailUser.id !== req.user.id) {
      throw new AppError('An account already exists for this email address', 409);
    }
  }

  const user = await userModel.updateProfile(req.user.id, {
    name: req.body.name,
    phoneNumber,
    email
  });

  res.json({
    success: true,
    data: {
      user: serializeUser(user)
    }
  });
});

module.exports = {
  getMe,
  updateMe
};
