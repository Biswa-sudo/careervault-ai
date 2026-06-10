const env = require('../../config/env');
const asyncHandler = require('../../utils/asyncHandler');
const { serializeUser } = require('../users/user.serializer');
const authService = require('./auth.service');

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.json({
    success: true,
    message: 'Logged in successfully',
    data: result
  });
});

const logout = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { resetToken } = await authService.requestPasswordReset(req.body.phoneNumber);

  res.json({
    success: true,
    message: 'If an account exists for this phone number, password reset instructions will be sent',
    data: env.nodeEnv === 'production' ? undefined : { resetToken }
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: serializeUser(req.user)
    }
  });
});

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  me
};
