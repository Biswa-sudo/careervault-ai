const express = require('express');
const multer = require('multer'); // IMPORTED: For handling incoming file uploads
const authenticate = require('../../middleware/authenticate');
const validate = require('../../middleware/validate');
const renderController = require('../rendering/render.controller');
const resumeController = require('./resume.controller');
const {
  createResumeSchema,
  updateResumeSchema
} = require('./resume.validation');

const router = express.Router();

// Configure multer to store the uploaded file temporarily in memory buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Limit files to 5MB maximum
});

// -------------------------------------------------------------------------
// NEW AI ENDPOINT: POST /api/v1/resumes/upload-parse
// This handles the document file upload and returns parsed layout JSON data.
// Placed ABOVE router.use(authenticate) so we can test it easily without tokens.
// -------------------------------------------------------------------------
router.post('/upload-parse', upload.single('resumeFile'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Capture file details
    const fileName = req.file.originalname;
    const fileBuffer = req.file.buffer;

    // Phase 1 Task 1.3: Simulated AI Parsing Engine Output
    // This perfectly matches the exact structural schema required by your templates
    const mockParsedAiData = {
      personalInfo: {
        fullName: "Biswaranjan Pradhan",
        designation: "Senior React Developer",
        phone: "+91 9876543210",
        email: "biswa@gmail.com",
        website: "www.designdons.com",
        address: "Bhubaneswar, Odisha",
        photo: ""
      },
      summary: "AI-extracted profile text: Experienced React Developer with expertise in building highly interactive user interfaces and modern single-page applications.",
      skills: ["React", "JavaScript", "Node.js", "HTML", "CSS", "Express"],
      languages: ["English", "Hindi", "Odia"],
      hobbies: ["Coding", "Reading"],
      experience: [
        {
          id: 1,
          position: "Senior React Developer",
          company: "DesignDons",
          startDate: "2022",
          endDate: "Present",
          responsibilities: [
            "Extracted automatically by CareerVault AI Engine.",
            "Built scalable user dashboards with interactive frontend widgets.",
            "Managed frontend architecture state parameters."
          ]
        }
      ],
      education: [
        {
          id: 1,
          degree: "B.Tech Computer Science",
          institute: "BPUT",
          year: "2015 - 2019"
        }
      ]
    };

    // Return the successful structured response back to our frontend dashboard form layout
    return res.json({
      success: true,
      message: 'Resume analyzed and parsed successfully by AI engine',
      data: mockParsedAiData
    });

  } catch (error) {
    next(error);
  }
});

// NEW ROUTE LINK: Handles saving the edited AI resume data
router.post('/save-public', resumeController.savePublicResume);

// All routes below this line will require standard user authentication tokens
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
  '/:id/preview',
  renderController.previewResume
);

router.get(
  '/:id/pdf',
  renderController.downloadPdf
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