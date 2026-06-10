// const templates = require('../../registry/template.registry');

const renderResume = (templateId, resumeData) => {
  switch (templateId) {
    case 'classic':
      return renderClassic(resumeData);

    case 'modern':
      return renderClassic(resumeData);

    case 'minimal-ats':
      return renderClassic(resumeData);

    default:
      return renderClassic(resumeData);
  }
};

const renderClassic = (data) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${data.name || 'Resume'}</title>
</head>
<body>
  <h1>${data.name || ''}</h1>

  <h2>Skills</h2>
  <ul>
    ${(data.skills || [])
      .map(skill => `<li>${skill}</li>`)
      .join('')}
  </ul>
</body>
</html>
`;
};

module.exports = {
  renderResume
};