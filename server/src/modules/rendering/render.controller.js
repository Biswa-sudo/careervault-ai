const resumeService = require('../resumes/resume.service');
const { generatePdf } = require('./pdf.service');
const { serializeResume } = require('../../serializers/resume.serializer');
const { renderResume } = require('./render.service');

const previewResume = async (req, res, next) => {
  try {
    const resume = await resumeService.getResumeById(
      req.params.id,
      req.user.id
    );

    const serialized = serializeResume(resume);

    console.log(JSON.stringify(serialized, null, 2));

    const html = renderResume(
      serialized.templateId,
      serialized.resumeData
    );

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    next(error);
  }
};

const downloadPdf = async (req, res, next) => {
  try {
    const resume = await resumeService.getResumeById(
      req.params.id,
      req.user.id
    );

    const serialized = serializeResume(resume);

    const html = renderResume(
      serialized.templateId,
      serialized.resumeData
    );

    const pdfBuffer = await generatePdf(html);

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=resume.pdf'
    );
console.log('Is Buffer:', Buffer.isBuffer(pdfBuffer));
console.log('Length:', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  previewResume,
  downloadPdf
};