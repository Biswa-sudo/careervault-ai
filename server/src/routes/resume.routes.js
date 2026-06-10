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

    res.send(pdfBuffer);

  } catch (error) {
    next(error);
  }
};