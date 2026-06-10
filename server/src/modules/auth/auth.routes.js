const express = require('express');
const authenticate = require('../../middleware/authenticate');
const validate = require('../../middleware/validate');
const { authLimiter } = require('../../middleware/rateLimiters');
const authController = require('./auth.controller');
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('./auth.validation');

const router = express.Router();

router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.get('/me', authenticate, authController.me);

module.exports = router;
