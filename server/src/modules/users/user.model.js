const { query } = require('../../db/pool');

async function createUser({ name, email, phoneNumber, passwordHash }) {
  const result = await query(
    `INSERT INTO users (name, email, phone_number, password_hash)
     VALUES (:name, :email, :phoneNumber, :passwordHash)`,
    { name, email: email || null, phoneNumber, passwordHash }
  );

  return findById(result.insertId);
}

async function findByPhoneNumber(phoneNumber) {
  const rows = await query(
    `SELECT * FROM users
     WHERE phone_number = :phoneNumber AND deleted_at IS NULL
     LIMIT 1`,
    { phoneNumber }
  );
  return rows[0] || null;
}

async function findByEmail(email) {
  if (!email) return null;

  const rows = await query(
    `SELECT * FROM users
     WHERE email = :email AND deleted_at IS NULL
     LIMIT 1`,
    { email }
  );
  return rows[0] || null;
}

async function findById(id) {
  const rows = await query(
    `SELECT * FROM users
     WHERE id = :id AND deleted_at IS NULL
     LIMIT 1`,
    { id }
  );
  return rows[0] || null;
}

async function updateLastLogin(id) {
  await query(
    `UPDATE users
     SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE id = :id`,
    { id }
  );
}

async function updateProfile(id, { name, email, phoneNumber }) {
  await query(
    `UPDATE users
     SET name = :name,
         email = :email,
         phone_number = :phoneNumber,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :id AND deleted_at IS NULL`,
    { id, name, email: email || null, phoneNumber }
  );

  return findById(id);
}

async function updatePassword(id, passwordHash) {
  await query(
    `UPDATE users
     SET password_hash = :passwordHash,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :id AND deleted_at IS NULL`,
    { id, passwordHash }
  );
}

async function createPasswordResetToken({ userId, tokenHash, expiresAt }) {
  await query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES (:userId, :tokenHash, :expiresAt)`,
    { userId, tokenHash, expiresAt }
  );
}

async function markActivePasswordResetTokensUsedForUser(userId) {
  await query(
    `UPDATE password_reset_tokens
     SET used_at = CURRENT_TIMESTAMP
     WHERE user_id = :userId
       AND used_at IS NULL
       AND expires_at > CURRENT_TIMESTAMP`,
    { userId }
  );
}

async function findValidPasswordResetToken(tokenHash) {
  const rows = await query(
    `SELECT prt.*, u.phone_number
     FROM password_reset_tokens prt
     INNER JOIN users u ON u.id = prt.user_id
     WHERE prt.token_hash = :tokenHash
       AND prt.used_at IS NULL
       AND prt.expires_at > CURRENT_TIMESTAMP
       AND u.deleted_at IS NULL
     LIMIT 1`,
    { tokenHash }
  );
  return rows[0] || null;
}

async function markPasswordResetTokenUsed(id) {
  await query(
    `UPDATE password_reset_tokens
     SET used_at = CURRENT_TIMESTAMP
     WHERE id = :id`,
    { id }
  );
}

module.exports = {
  createUser,
  findByPhoneNumber,
  findByEmail,
  findById,
  updateLastLogin,
  updateProfile,
  updatePassword,
  createPasswordResetToken,
  markActivePasswordResetTokensUsedForUser,
  findValidPasswordResetToken,
  markPasswordResetTokenUsed
};
