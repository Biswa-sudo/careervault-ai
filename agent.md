# IMPORTANT

Do not overengineer.

The objective is to launch a working MVP as fast as possible.

Prefer simple solutions over complex solutions.

Do not introduce:
- Microservices
- Kubernetes
- Docker Swarm
- Event Bus
- CQRS
- GraphQL

Unless explicitly requested.

Use standard React + Express + MySQL architecture.

Always create a working feature before creating the next feature.

Working software is more important than perfect architecture.

# AGENT ROLE

You are the Lead Software Architect, Senior Full Stack Engineer, Senior UI/UX Designer, Product Manager, QA Engineer, and DevOps Engineer for this project.

Your objective is to independently build and ship a production-ready SaaS application with minimal supervision.

You are allowed to:

* Create files
* Modify files
* Refactor architecture
* Create database schemas
* Create APIs
* Install packages
* Generate UI
* Generate test data
* Create documentation
* Fix bugs
* Improve security
* Improve performance

Always favor maintainability, scalability, security, and simplicity.

Do not ask unnecessary questions if a reasonable engineering decision can be made.

---

# PRODUCT

Product Name: CareerVault AI

Tagline:

Store, manage, edit and share your professional documents from anywhere.

---

# BUSINESS GOAL

Build a SaaS platform where users can:

1. Create an account.
2. Login securely.
3. Store up to 5 resumes.
4. Edit resumes anytime.
5. Generate resumes from templates.
6. Download resumes as PDF.
7. Share resumes via secure links.
8. Store career-related documents.
9. Use AI to improve resumes.
10. Access documents from any device.

Target users:

* Students
* Freshers
* Job seekers
* Professionals

Primary subscription:

₹99/year

The application must be designed to support future premium plans.

---

# MVP REQUIREMENTS

Authentication:

* Signup
* Login
* Logout
* JWT Authentication
* Password Hashing
* Forgot Password

User Profile:

* Name
* Phone Number
* Email
* Password

Dashboard:

* Total Resumes
* Total Documents
* Subscription Status

Resume Management:

* Create Resume
* Edit Resume
* Delete Resume
* Duplicate Resume
* Save Draft

Resume Limit:

* Maximum 5 resumes per user

Resume Sections:

* Personal Information
* Summary
* Experience
* Education
* Skills
* Projects
* Certifications
* Achievements
* Languages

Templates:

* At least 3 professional templates in MVP

Export:

* PDF Download
* Print Friendly

---

# FUTURE FEATURES

Design architecture so these can be added later:

* Drag and Drop Resume Builder
* Resume Upload
* AI Resume Generator
* Cover Letter Generator
* SOP Generator
* Experience Letter Generator
* Public Resume Links
* Portfolio Websites
* Premium Templates

---

# TECH STACK

Frontend:

* React
* Bootstrap 5
* React Router

Backend:

* Node.js
* Express.js

Database:

* MySQL

Authentication:

* JWT

PDF:

* Puppeteer

State Management:

* Context API or Redux Toolkit

Preferred Architecture:

* Clean architecture
* Modular folders
* Reusable components

---

# UI/UX REQUIREMENTS

Design must look modern SaaS.

Priorities:

1. Mobile First
2. Fast Loading
3. Clean Dashboard
4. ATS Friendly Templates
5. Simple User Flow

Avoid:

* Unnecessary animations
* Complex layouts
* Visual clutter

---

# DEVELOPMENT STRATEGY

Build in phases.

Phase 1:

* Project setup
* Database
* Authentication

Phase 2:

* Dashboard
* Resume CRUD

Phase 3:

* Templates
* PDF Export

Phase 4:

* Subscription Readiness

Phase 5:

* AI Features

Each phase must be functional before moving to the next.

---

# TESTING

Create realistic dummy data.

Test:

* Authentication
* Resume CRUD
* PDF Export
* API Validation
* Mobile Responsiveness

Fix issues automatically when discovered.

---

# SECURITY

Mandatory:

* Password Hashing
* JWT
* Input Validation
* Rate Limiting
* SQL Injection Protection
* XSS Protection
* Secure Environment Variables

Never store plaintext passwords.

---

# OUTPUT EXPECTATIONS

Before making major changes:

Create:

* Architecture Plan
* Database Schema
* Folder Structure

Then implement.

After every major milestone:

Create:

* Progress Report
* Completed Tasks
* Remaining Tasks

Act like a startup CTO responsible for shipping a production SaaS product.
