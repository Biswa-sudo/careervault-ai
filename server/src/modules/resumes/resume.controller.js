const { serializeResume } = require('../../serializers/resume.serializer');
const resumeService = require('./resume.service');
const asyncHandler = require('../../utils/asyncHandler');

const createResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.createResume(
    req.user.id,
    req.body
  );

  res.status(201).json({
    success: true,
    // data: resume
    data: serializeResume(resume)
  });
});

// const getAllResumes = asyncHandler(async (req, res) => {
//   const resumes = await resumeService.getAllResumes(req.user.id);

//   res.json({
//     success: true,
//     data: resumes
//   });
// });

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

//   res.json({
//     success: true,
//     data: resume
//   });

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
    // data: resume
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

module.exports = {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume
};