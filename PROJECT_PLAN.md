# CareerVault AI Project Plan

## Product Vision

CareerVault AI is a lightweight SaaS platform for students, freshers, job seekers, and professionals who need one secure place to create, edit, store, download, and eventually improve career documents. The first commercial wedge is simple: offer a dependable resume vault and builder for ₹99/year, with enough polish and reliability to convert users who currently manage resumes across phones, email drafts, Google Drive, and random PDF files.

The product should launch fast with a small, useful core: secure accounts, profile data, resume storage, and the backend foundation for resume/document workflows. AI, premium templates, public portfolio pages, and payment automation should be added only after the base workflow proves demand.

## Business Model Analysis

- Primary revenue: ₹99/year subscription for individual users.
- Target buyer behavior: low price, high trust requirement, mobile-first access, quick value within minutes.
- Early acquisition channels: campus groups, LinkedIn content, resume-review communities, job-prep influencers, and referral discounts.
- Profitability assumption: low infrastructure cost per user, low support burden, and template/PDF/AI features added only after validation.
- Key opportunity: users value convenience and confidence more than complex builder features. A fast, safe vault plus clean ATS-friendly output can ship sooner than AI-heavy competitors.

## Risks, Assumptions, Bottlenecks, And Opportunities

- Risk: ₹99/year leaves little room for expensive AI usage. AI must be usage-limited or premium later.
- Risk: Resume PDF quality can become a trust-breaking issue. Templates should be ATS-friendly and print-stable before visual complexity.
- Risk: Password reset, authentication, and file handling are security-sensitive. Phase 1 must set a strong baseline.
- Assumption: Users will pay for convenience if resume creation, storage, and download are smoother than free document editors.
- Assumption: A 5-resume limit is enough for the MVP and creates a clear upgrade path later.
- Bottleneck: Payment integration and AI quality are not required to validate account creation and resume workflows.
- Opportunity: Add document vault, public links, and AI resume improvements as premium conversion hooks.

## Smallest Launchable MVP

The smallest paid-launch MVP is:

- User signup, login, logout, and password reset flow.
- Dashboard summary with resume/document counts and subscription status.
- Resume CRUD with a hard 5-resume limit.
- Resume sections stored as structured JSON.
- Three ATS-friendly templates.
- PDF download and print-friendly preview.
- Basic subscription status field ready for future payment integration.

Phase 1 intentionally implements only the backend foundation for authentication, user data, security, validation, and database migrations.

## MVP Scope

### Included

- Express API server.
- MySQL database integration.
- Environment configuration.
- Auth system with JWT access tokens.
- Password hashing with bcrypt.
- User model and user profile fields.
- Forgot password token creation.
- Request validation.
- Centralized error handling.
- Security middleware, rate limits, CORS, and HTTP headers.
- SQL migration and seed scripts.

### Deferred

- React frontend.
- Resume CRUD.
- PDF generation.
- Subscription payment provider.
- AI features.
- Public sharing links.
- File uploads.

## Feature Prioritization

1. Authentication and user foundation: required for every later feature.
2. Resume CRUD and dashboard metrics: core user value.
3. Templates and PDF export: makes the product useful enough to share and sell.
4. Subscription readiness: enforce plan limits and prepare payment records.
5. AI features: conversion and retention feature after product usage is validated.
6. Public links and document vault: expansion once trust and storage workflows are stable.

## User Flow

1. User lands on the app.
2. User creates an account with name, phone number, optional email, and password.
3. User logs in and receives a secure JWT.
4. User sees dashboard counts and subscription status.
5. User creates or edits resumes, up to the plan limit.
6. User selects a template and downloads a PDF.
7. User upgrades or renews when payment integration is added.

## Technical Architecture

Use a standard monolithic SaaS architecture:

- Frontend: React, Bootstrap 5, React Router.
- Backend: Node.js, Express.js.
- Database: MySQL.
- Authentication: JWT access tokens, bcrypt password hashing.
- Validation: Joi request schemas.
- Security: helmet, CORS allowlist, rate limiting, parameterized queries, centralized error responses.
- Migrations: plain SQL files with a small Node migration runner.

### Reasoning

This structure is the fastest path to launch because it uses proven technologies, simple deployment, and easy hiring/maintenance. Microservices, Kubernetes, event-driven architecture, CQRS, and GraphQL are excluded because they increase operational complexity without helping the first paid users create and manage resumes faster.

## Folder Structure

```text
cvb4a/
  client/
  database/
    migrations/
    seeds/
  server/
    package.json
    .env.example
    src/
      app.js
      server.js
      config/
      db/
      middleware/
      modules/
        auth/
        users/
      utils/
    scripts/
```

## Database Schema

### users

- id: BIGINT UNSIGNED primary key.
- name: VARCHAR(120), required.
- phone_number: VARCHAR(30), required, unique.
- email: VARCHAR(191), nullable, unique.
- password_hash: VARCHAR(255), required.
- subscription_status: ENUM('free','active','expired','cancelled'), default 'free'.
- subscription_plan: VARCHAR(50), default 'free'.
- resume_limit: TINYINT UNSIGNED, default 5.
- email_verified_at: DATETIME, nullable.
- last_login_at: DATETIME, nullable.
- created_at: DATETIME, required.
- updated_at: DATETIME, required.
- deleted_at: DATETIME, nullable.

### password_reset_tokens

- id: BIGINT UNSIGNED primary key.
- user_id: BIGINT UNSIGNED foreign key to users.id.
- token_hash: CHAR(64), required.
- expires_at: DATETIME, required.
- used_at: DATETIME, nullable.
- created_at: DATETIME, required.

### migrations

- id: BIGINT UNSIGNED primary key.
- filename: VARCHAR(255), required, unique.
- executed_at: DATETIME, required.

Future tables: resumes, resume_versions, documents, templates, shared_links, subscriptions, payments, ai_usage_logs.

## API Design

Base path: `/api/v1`

### Health

- `GET /health` returns service and database status.

### Authentication

- `POST /api/v1/auth/signup` creates a user with phone number as the primary credential and returns a JWT.
- `POST /api/v1/auth/login` authenticates by phone number and password and returns a JWT.
- `POST /api/v1/auth/logout` returns success for client-side token removal.
- `POST /api/v1/auth/forgot-password` creates a reset token and returns a safe development response.
- `POST /api/v1/auth/reset-password` validates a reset token and updates the password.
- `GET /api/v1/auth/me` returns the authenticated user.

### Users

- `GET /api/v1/users/me` returns the current profile.
- `PATCH /api/v1/users/me` updates name and phone number.

## Security Design

- Store only bcrypt password hashes.
- Sign JWTs with `JWT_SECRET` from environment variables.
- Use short access token expiry by default.
- Validate all request bodies with Joi.
- Use parameterized MySQL queries through `mysql2`.
- Add helmet security headers.
- Configure CORS by allowlist.
- Rate-limit global API requests and stricter auth requests.
- Normalize phone numbers before persistence and authentication.
- Normalize optional emails before persistence.
- Store password reset tokens as SHA-256 hashes, never plaintext.
- Do not reveal whether a phone number exists during forgot-password.
- Keep secrets out of source control using `.env` and `.env.example`.

## Deployment Strategy

MVP deployment should use the simplest reliable setup:

- Backend: single Node.js service on Render, Railway, Fly.io, or a VPS with PM2.
- Database: managed MySQL where possible.
- Frontend later: Vercel/Netlify or served separately from the backend.
- Environment variables configured per deployment environment.
- Run migrations before release.
- Use HTTPS at the platform/load balancer layer.
- Add monitoring/logging after the first deploy using platform logs and uptime checks.

Docker, Kubernetes, and multi-service orchestration are unnecessary for the first launch.

## Development Roadmap

### Phase 1: Backend Foundation

- Express backend.
- MySQL integration.
- Environment configuration.
- Authentication system.
- JWT security.
- Password hashing.
- User model.
- API validation.
- Error handling.
- Security middleware.
- Database migration scripts.

### Phase 2: Dashboard And Resume CRUD

- Dashboard API.
- Resume model and migrations.
- Resume CRUD endpoints.
- Enforce 5-resume limit.
- Draft and duplicate support.

### Phase 3: Templates And PDF Export

- Three ATS-friendly templates.
- Print preview.
- Puppeteer PDF generation.
- Template selection.

### Phase 4: Subscription Readiness

- Subscription tables.
- Plan enforcement.
- Payment provider integration.
- Renewal and expiry handling.

### Phase 5: AI Features

- AI resume improvement.
- Usage limits.
- Prompt/version logging.
- Premium AI plans if cost requires it.

## Future Expansion Strategy

- Add document vault after resume CRUD proves engagement.
- Add public resume links with expiring/revocable share tokens.
- Add AI resume suggestions as a premium conversion feature.
- Add cover letter, SOP, and experience letter generators.
- Add premium templates and portfolio websites.
- Add team/campus partnerships if individual acquisition works.
- Introduce background jobs only when PDF or AI processing volume requires it.

## Launch Philosophy

CareerVault AI should ship with a narrow, reliable workflow before chasing feature breadth. The product wins early if users can create an account, store resumes safely, produce clean PDFs, and trust that their career documents are available anywhere.
