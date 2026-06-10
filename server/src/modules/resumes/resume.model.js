const { query } = require('../../db/pool');

async function createResume({ userId, title, resumeData, templateId = 'default' }) {
  const result = await query(
    `INSERT INTO resumes (user_id, title, resume_data, template_id)
     VALUES (:userId, :title, :resumeData, :templateId)`,
    {
      userId,
      title,
      resumeData: JSON.stringify(resumeData),
      templateId
    }
  );

  return findById(result.insertId, userId);
}

async function findById(id, userId) {
  const rows = await query(
    `SELECT *
     FROM resumes
     WHERE id = :id
       AND user_id = :userId
     LIMIT 1`,
    { id, userId }
  );

  return rows[0] || null;
}

async function findAllByUserId(userId) {
  return query(
    `SELECT *
     FROM resumes
     WHERE user_id = :userId
     ORDER BY updated_at DESC`,
    { userId }
  );
}

async function countByUserId(userId) {
  const rows = await query(
    `SELECT COUNT(*) AS total
     FROM resumes
     WHERE user_id = :userId`,
    { userId }
  );

  return rows[0].total;
}

async function updateResume(id, userId, { title, resumeData, templateId }) {
  await query(
    `UPDATE resumes
     SET title = :title,
         resume_data = :resumeData,
         template_id = :templateId,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :id
       AND user_id = :userId`,
    {
      id,
      userId,
      title,
      resumeData: JSON.stringify(resumeData),
      templateId
    }
  );

  return findById(id, userId);
}

async function deleteResume(id, userId) {
  await query(
    `DELETE FROM resumes
     WHERE id = :id
       AND user_id = :userId`,
    { id, userId }
  );
}

module.exports = {
  createResume,
  findById,
  findAllByUserId,
  countByUserId,
  updateResume,
  deleteResume
};

