const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      phoneNumber: user.phone_number
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};
