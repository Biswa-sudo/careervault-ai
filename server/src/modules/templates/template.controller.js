const templates = require('../../registry/template.registry');

const getTemplates = (req, res) => {
  res.json({
    success: true,
    data: templates
  });
};

const getTemplateById = (req, res) => {
  const template = templates.find(
    t => t.id === req.params.id
  );

  if (!template) {
    return res.status(404).json({
      success: false,
      message: 'Template not found'
    });
  }

  res.json({
    success: true,
    data: template
  });
};

module.exports = {
  getTemplates,
  getTemplateById
};