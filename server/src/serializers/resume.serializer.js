const serializeResume = (resume) => {
  let resumeData = {};

  try {
    resumeData =
      typeof resume.resume_data === 'string'
        ? JSON.parse(resume.resume_data)
        : resume.resume_data;
  } catch (error) {
    resumeData = {};
  }

  return {
    id: resume.id,
    title: resume.title,
    templateId: resume.template_id,
    resumeData,
    createdAt: resume.created_at,
    updatedAt: resume.updated_at
  };
};

module.exports = {
  serializeResume
};