const resumeModel = require('./resume.model');
const AppError = require('../../utils/AppError');

async function createResume(userId, data) {
  const count = await resumeModel.countByUserId(userId);

  if (count >= 5) {
    throw new AppError('Resume limit reached. Maximum 5 resumes allowed.', 400);
  }

  return resumeModel.createResume({
    userId,
    title: data.title,
    resumeData: data.resumeData,
    templateId: data.templateId || 'default'
  });
}

async function getAllResumes(userId) {
  return resumeModel.findAllByUserId(userId);
}

async function getResumeById(id, userId) {
  const resume = await resumeModel.findById(id, userId);

  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  return resume;
}

async function updateResume(id, userId, data) {
  const existing = await resumeModel.findById(id, userId);

  if (!existing) {
    throw new AppError('Resume not found', 404);
  }

  return resumeModel.updateResume(id, userId, data);
}

async function deleteResume(id, userId) {
  const existing = await resumeModel.findById(id, userId);

  if (!existing) {
    throw new AppError('Resume not found', 404);
  }

  await resumeModel.deleteResume(id, userId);

  return { success: true };
}

module.exports = {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume
};