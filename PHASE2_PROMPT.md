Read:

* PROJECT_PLAN.md
* CLAUDE_CONTEXT.md
* Existing backend codebase

First create:

PHASE1_REVIEW.md

Include:

* Security Improvements
* Architecture Improvements
* MVP Simplifications
* Technical Debt
* Recommended Refactoring

Do not modify code during the review.

After review is complete, implement Phase 2 only:

Resume Backend CRUD

Requirements:

* resumes table
* migration file
* resume model
* resume validation
* resume service
* resume controller
* resume routes

Resume fields:

* id
* user_id
* title
* resume_data (JSON)
* template_id
* created_at
* updated_at

Business Rules:

* Maximum 5 resumes per user
* Users can only access their own resumes
* All endpoints require authentication

Required APIs:

POST /api/v1/resumes
GET /api/v1/resumes
GET /api/v1/resumes/:id
PATCH /api/v1/resumes/:id
DELETE /api/v1/resumes/:id

Do NOT build:

* React frontend
* Templates
* PDF export
* AI features
* Drag and drop
* Payments
* File uploads

After implementation:

1. Verify imports
2. Verify migrations
3. Verify routes
4. Create TESTING_PHASE2.md
5. Create COMPLETED_TASKS_PHASE2.md

Follow existing architecture and coding style.
