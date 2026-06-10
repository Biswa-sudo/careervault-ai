function normalizePhoneNumber(value) {
  return String(value || '')
    .trim()
    .replace(/[\s().-]/g, '');
}

function isValidNormalizedPhoneNumber(value) {
  return /^\+?[1-9]\d{6,14}$/.test(value);
}

module.exports = {
  normalizePhoneNumber,
  isValidNormalizedPhoneNumber
};
