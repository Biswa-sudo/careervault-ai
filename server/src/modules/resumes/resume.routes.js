const express = require('express');
const authenticate = require('../../middleware/authenticate');
const validate = require('../../middleware/validate');
const resumeController = require('./resume.controller');
const {
  createResumeSchema,
  updateResumeSchema
} = require('./resume.validation');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  validate(createResumeSchema),
  resumeController.createResume
);

router.get(
  '/',
  resumeController.getAllResumes
);

router.get(
  '/:id',
  resumeController.getResumeById
);

router.patch(
  '/:id',
  validate(updateResumeSchema),
  resumeController.updateResume
);

router.delete(
  '/:id',
  resumeController.deleteResume
);

module.exports = router;