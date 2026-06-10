# Next Steps

## Immediate

1. Create `server/.env` from `server/.env.example`.
2. Set valid local MySQL credentials. The default `root` user currently returns `Access denied for user 'root'@'localhost'`.
3. Run `cd server && npm run migrate`.
4. Run `cd server && npm run seed`.
5. Start the API with `cd server && npm run dev`.
6. Test phone-number signup, phone-number login, `/api/v1/auth/me`, and profile update with an API client.

## Phase 2

1. Add dashboard summary endpoint.
2. Add resume database schema.
3. Implement resume CRUD.
4. Enforce the maximum 5-resume limit per user.
5. Add duplicate resume and save draft support.
6. Add realistic resume seed data.

## Phase 3

1. Add three ATS-friendly resume templates.
2. Add print-friendly rendering.
3. Add Puppeteer PDF export.
4. Add template selection per resume.

## Business

1. Validate whether users understand and value the ₹99/year offer.
2. Recruit early testers from students, freshers, and job seeker communities.
3. Track where users abandon signup or resume creation once the frontend exists.
4. Add payment integration only after resume CRUD and PDF output are reliable.
