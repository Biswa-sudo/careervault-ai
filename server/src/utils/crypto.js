const crypto = require('crypto');

function createSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

module.exports = {
  createSecureToken,
  sha256
};
