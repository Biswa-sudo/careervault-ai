const serializeResume = (resume) => {
  return {
    id: resume.id,
    title: resume.title,
    templateId: resume.template_id,
    data:
      typeof resume.resume_data === "string"
        ? JSON.parse(resume.resume_data)
        : resume.resume_data,
    createdAt: resume.created_at,
    updatedAt: resume.updated_at
  };
};

module.exports = {
  serializeResume
};