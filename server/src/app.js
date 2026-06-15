const express = require('express');
const morgan = require('morgan');
const env = require('./config/env');
const { checkDatabase } = require('./db/pool');
const { pool } = require('./db/pool'); // Imported raw database pool object to execute our fast lookups
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { apiLimiter } = require('./middleware/rateLimiters');
const securityMiddleware = require('./middleware/security');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const resumeRoutes = require('./modules/resumes/resume.routes');
const templateRoutes = require('./modules/templates/template.routes');

const app = express();

securityMiddleware(app);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.logLevel));
}

app.use(apiLimiter);

// -------------------------------------------------------------------------
// NEW STRATEGIC FEATURE: THE UNPROTECTED PUBLIC PHONE PORTFOLIO ENDPOINT
// This serves the dynamic HTML portfolio instantly when someone types /cv/9876543210
// -------------------------------------------------------------------------
app.get('/cv/:phoneNumber', async (req, res, next) => {
  try {
    const { phoneNumber } = req.params;

    // Fast multi-table SQL query fetching the primary resume connected to this phone number
    const queryResult = await pool.query(
      `SELECT r.*, u.name, u.email as user_email 
       FROM resumes r 
       JOIN users u ON r.user_id = u.id 
       WHERE u.phone_number = ? LIMIT 1`,
       [phoneNumber]
    );

    // Default Fallback Dataset
    const fallbackPayload = {
      personalInfo: {
        fullName: "Biswaranjan Pradhan",
        designation: "Senior React Developer",
        phone: phoneNumber,
        email: "biswa@gmail.com",
        website: "www.designdons.com",
        address: "Bhubaneswar, Odisha",
        photo: ""
      },
      summary: "Experienced React Developer with 5+ years of expertise in React, JavaScript, UI/UX Design, Node.js and scalable web application development.",
      skills: ["React", "JavaScript", "Node.js", "HTML", "CSS", "MySQL"],
      languages: ["English", "Hindi", "Odia"],
      hobbies: ["Coding", "Cricket", "Reading"],
      experience: [
        {
          id: 1,
          position: "Senior React Developer",
          company: "DesignDons",
          startDate: "2022",
          endDate: "Present",
          responsibilities: [
            "Built scalable React applications",
            "Designed reusable components",
            "Optimized performance"
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

    let dataPayload = fallbackPayload;

    // Safely look inside MySQL's nested array results wrapper
    if (queryResult) {
      let rows = [];
      if (Array.isArray(queryResult[0])) {
        rows = queryResult[0]; // Typical mysql2 pool query extraction pattern
      } else if (Array.isArray(queryResult)) {
        rows = queryResult;
      } else if (queryResult.rows) {
        rows = queryResult.rows;
      }

      // If a database record exists and it contains actual resume field structures
      if (rows && rows.length > 0 && rows[0].resume_data) {
        const dbRow = rows[0];
        try {
          dataPayload = typeof dbRow.resume_data === 'string' 
            ? JSON.parse(dbRow.resume_data) 
            : dbRow.resume_data;
            
          // Double check to make sure the parsed object has the personalInfo key
          if (!dataPayload || !dataPayload.personalInfo) {
            dataPayload = fallbackPayload;
          }
        } catch (e) {
          dataPayload = fallbackPayload; // JSON parsing failed, use the safe template
        }
      }
    }

    // Direct HTML Generation Stream Engine
    const fullHtmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dataPayload.personalInfo.fullName} - Resume</title>
    <style>
      *{ margin:0; padding:0; box-sizing:border-box; font-family: Arial, sans-serif; }
      body{ background:#f5f5f5; padding:30px; }
      .resume{ width:900px; margin:auto; background:#fff; display:flex; box-shadow:0 0 20px rgba(0,0,0,.1); }
      .left{ width:32%; background:#1f2937; color:#fff; padding:30px; }
      .right{ width:68%; padding:35px; }
      .profile-image{ width:130px; height:130px; border-radius:50%; overflow:hidden; margin:auto; border:4px solid #fff; }
      .profile-image img{ width:100%; height:100%; object-fit:cover; }
      .name{ text-align:center; margin-top:15px; }
      .name h1{ font-size:26px; }
      .name p{ color:#cbd5e1; margin-top:5px; }
      .section{ margin-top:35px; }
      .section-title{ font-size:18px; text-transform:uppercase; margin-bottom:15px; padding-bottom:8px; border-bottom:2px solid rgba(255,255,255,.3); }
      .right .section-title{ color:#111827; border-bottom:2px solid #ddd; }
      .contact-item, .skill-item, .language-item, .hobby-item{ margin-bottom:10px; font-size:14px; line-height:1.6; }
      .profile-text{ color:#555; line-height:1.8; font-size:14px; }
      .job{ margin-bottom:25px; }
      .job-header{ display:flex; justify-content:space-between; margin-bottom:8px; }
      .job-title{ font-weight:bold; color:#111827; }
      .job-date{ color:#777; font-size:13px; }
      .job-company{ color:#666; margin-bottom:8px; font-size:14px; }
      .job ul{ padding-left:18px; color:#555; line-height:1.8; }
      .education{ margin-bottom:20px; }
      .education h4{ margin-bottom:5px; }
      .education p{ color:#666; line-height:1.6; }
    </style>
    </head>
    <body>
    <div class="resume">
        <div class="left">
            <div class="profile-image">
                <img src="${dataPayload.personalInfo.photo || 'https://via.placeholder.com/200'}" alt="Photo">
            </div>
            <div class="name">
                <h1>${dataPayload.personalInfo.fullName}</h1>
                <p>${dataPayload.personalInfo.designation}</p>
            </div>
            <div class="section">
                <h3 class="section-title">Contact</h3>
                <div class="contact-item">📞 ${dataPayload.personalInfo.phone}</div>
                <div class="contact-item">✉️ ${dataPayload.personalInfo.email}</div>
                <div class="contact-item">🌐 ${dataPayload.personalInfo.website}</div>
                <div class="contact-item">📍 ${dataPayload.personalInfo.address}</div>
            </div>
            <div class="section">
                <h3 class="section-title">Skills</h3>
                ${dataPayload.skills.map(s => `<div class="skill-item">• ${s}</div>`).join('')}
            </div>
            <div class="section">
                <h3 class="section-title">Languages</h3>
                ${dataPayload.languages.map(l => `<div class="language-item">• ${l}</div>`).join('')}
            </div>
            <div class="section">
                <h3 class="section-title">Hobbies</h3>
                ${dataPayload.hobbies.map(h => `<div class="hobby-item">• ${h}</div>`).join('')}
            </div>
        </div>
        <div class="right">
            <div class="section">
                <h3 class="section-title">Profile</h3>
                <p class="profile-text">${dataPayload.summary}</p>
            </div>
            <div class="section">
                <h3 class="section-title">Work Experience</h3>
                ${dataPayload.experience.map(exp => `
                    <div class="job">
                        <div class="job-header">
                            <div class="job-title">${exp.position}</div>
                            <div class="job-date">${exp.startDate} - ${exp.endDate}</div>
                        </div>
                        <div class="job-company">${exp.company}</div>
                        <ul>${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>
                    </div>
                `).join('')}
            </div>
            <div class="section">
                <h3 class="section-title">Education</h3>
                ${dataPayload.education.map(edu => `
                    <div class="education">
                        <h4>${edu.degree}</h4>
                        <p>${edu.institute}</p>
                        <p>${edu.year}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
    </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.send(fullHtmlTemplate);

  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/health', async (_req, res, next) => {
  try {
    const databaseOk = await checkDatabase();
    res.json({
      success: true,
      data: {
        service: 'CareerVault AI API',
        status: 'ok',
        database: databaseOk ? 'ok' : 'unavailable',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

// Standard Route Attachments
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/templates', templateRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;