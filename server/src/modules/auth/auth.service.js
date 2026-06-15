const bcrypt = require('bcryptjs');
const env = require('../../config/env');
const AppError = require('../../utils/AppError');
const { createSecureToken, sha256 } = require('../../utils/crypto');
const { signAccessToken } = require('../../utils/jwt');
const { normalizePhoneNumber } = require('../../utils/phone');
const userModel = require('../users/user.model');
const { serializeUser } = require('../users/user.serializer');

async function hashPassword(password) {
  return bcrypt.hash(password, env.bcryptRounds);
}

async function signup(payload) {
  const phoneNumber = normalizePhoneNumber(payload.phoneNumber);
  const email = payload.email ? payload.email.toLowerCase() : null;
  const existingUser = await userModel.findByPhoneNumber(phoneNumber);

  if (existingUser) {
    throw new AppError('An account already exists for this phone number', 409);
  }

  if (email) {
    const existingEmailUser = await userModel.findByEmail(email);
    if (existingEmailUser) {
      throw new AppError('An account already exists for this email address', 409);
    }
  }

  const passwordHash = await hashPassword(payload.password);
  
  // FIXED: Changed payload.name to payload.fullName to perfectly match our frontend form field
  const user = await userModel.createUser({
    name: payload.fullName || payload.name, 
    email,
    phoneNumber,
    passwordHash,
    isSubscribed: false // Defaulting new accounts to non-subscribed status for our guard gate
  });

  const accessToken = signAccessToken(user);

  return {
    user: serializeUser(user),
    accessToken
  };
}

async function login({ phoneNumber, password }) {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const user = await userModel.findByPhoneNumber(normalizedPhoneNumber);

  if (!user) {
    throw new AppError('Invalid phone number or password', 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new AppError('Invalid phone number or password', 401);
  }

  await userModel.updateLastLogin(user.id);
  const refreshedUser = await userModel.findById(user.id);

  return {
    user: serializeUser(refreshedUser),
    accessToken: signAccessToken(refreshedUser)
  };
}

async function requestPasswordReset(phoneNumber) {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const user = await userModel.findByPhoneNumber(normalizedPhoneNumber);

  if (!user) {
    return { resetToken: createSecureToken() };
  }

  const resetToken = createSecureToken();
  const tokenHash = sha256(resetToken);
  const expiresAt = new Date(Date.now() + env.passwordResetExpiresMinutes * 60 * 1000);

  await userModel.markActivePasswordResetTokensUsedForUser(user.id);
  await userModel.createPasswordResetToken({
    userId: user.id,
    tokenHash,
    expiresAt
  });

  return { resetToken };
}

async function resetPassword({ token, password }) {
  const tokenHash = sha256(token);
  const resetRecord = await userModel.findValidPasswordResetToken(tokenHash);

  if (!resetRecord) {
    throw new AppError('Invalid or expired password reset token', 400);
  }

  const passwordHash = await hashPassword(password);
  await userModel.updatePassword(resetRecord.user_id, passwordHash);
  await userModel.markActivePasswordResetTokensUsedForUser(resetRecord.user_id);
}

module.exports = {
  signup,
  login,
  requestPasswordReset,
  resetPassword
};