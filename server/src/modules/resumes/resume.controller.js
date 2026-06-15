const { serializeResume } = require('../../serializers/resume.serializer');
const resumeService = require('./resume.service');
const asyncHandler = require('../../utils/asyncHandler');
const { pool } = require('../../db/pool'); // Imported raw database pool for swift updates

const createResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.createResume(
    req.user.id,
    req.body
  );

  res.status(201).json({
    success: true,
    data: serializeResume(resume)
  });
});

const getAllResumes = asyncHandler(async (req, res) => {
  const resumes = await resumeService.getAllResumes(req.user.id);

  res.status(200).json({
    success: true,
    data: resumes.map(serializeResume)
  });
});

const getResumeById = asyncHandler(async (req, res) => {
  const resume = await resumeService.getResumeById(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    success: true,
    data: serializeResume(resume)
  });
});

const updateResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.updateResume(
    req.params.id,
    req.user.id,
    req.body
  );

  res.json({
    success: true,
    data: serializeResume(resume)
  });
});

const deleteResume = asyncHandler(async (req, res) => {
  await resumeService.deleteResume(
    req.params.id,
    req.user.id
  );

  res.json({
    success: true,
    message: 'Resume deleted successfully'
  });
});

// -------------------------------------------------------------------------
// NEW AI ENDPOINT CONTROLLER METHOD: savePublicResume
// Phase 3 Task 3.1: Captures workspace edits and writes them directly to MySQL
// -------------------------------------------------------------------------
const savePublicResume = asyncHandler(async (req, res) => {
  const { phoneNumber, resumeData } = req.body;

  if (!phoneNumber || !resumeData) {
    return res.status(400).json({
      success: false,
      message: 'Missing required phoneNumber or resumeData payload.'
    });
  }

  // Find the user ID connected to this specific phone number string
  const userCheck = await pool.query(
    'SELECT id FROM users WHERE phone_number = ? LIMIT 1',
    [phoneNumber]
  );

  let rows = Array.isArray(userCheck[0]) ? userCheck[0] : (userCheck.rows || userCheck);
  if (!rows || rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No corresponding user account found matching this portfolio phone string.'
    });
  }

  const userId = rows[0].id;
  const targetDataString = typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData);

  // Check if a resume row already exists for this target profile user
  const resumeCheck = await pool.query(
    'SELECT id FROM resumes WHERE user_id = ? LIMIT 1',
    [userId]
  );
  let resumeRows = Array.isArray(resumeCheck[0]) ? resumeCheck[0] : (resumeCheck.rows || resumeCheck);

  if (resumeRows && resumeRows.length > 0) {
    // Row exists: Update it directly
    await pool.query(
      'UPDATE resumes SET resume_data = ? WHERE user_id = ?',
      [targetDataString, userId]
    );
  } else {
    // Row missing: Insert a completely fresh record
    await pool.query(
      'INSERT INTO resumes (user_id, resume_data, is_primary) VALUES (?, ?, true)',
      [userId, targetDataString]
    );
  }

  res.status(200).json({
    success: true,
    message: 'Portfolio data saved and synchronized successfully to your live URL!'
  });
});

module.exports = {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  savePublicResume // Exported to use inside our routes registry
};