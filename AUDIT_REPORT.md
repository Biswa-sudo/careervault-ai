# Backend Audit Report

Date: 2026-06-10

## Issues Found

1. Phone number validation allowed formatting characters but did not validate the normalized value before storage.
2. Password reset flow allowed multiple active reset tokens for the same user.
3. Forgot-password development responses could reveal account existence by returning `null` for unknown phone numbers.
4. MySQL duplicate-key race conditions could surface as generic `500` errors.
5. Numeric environment variables had no practical bounds, allowing unsafe values such as weak bcrypt rounds or invalid ports.
6. Startup listen failures emitted an unhandled server `error` event.
7. `npm run verify` only imported the Express app and did not check all local source imports or circular dependencies.
8. Seed script did not refresh `password_hash` or `resume_limit` on repeated seed runs, which could make documented demo credentials stale.
9. Migration execution could not be completed in this environment because local MySQL rejected the default credentials.

## Fixes Applied

1. Added normalized phone-number validation using `normalizePhoneNumber` and `isValidNormalizedPhoneNumber`.
2. Updated auth and profile Joi schemas to return normalized phone numbers.
3. Added reset-token invalidation before issuing a new reset token and after successful password reset.
4. Changed forgot-password behavior to return a fake development token for unknown phone numbers, preserving response shape without creating a database record.
5. Added duplicate-key handling in centralized error middleware with a `409` response.
6. Added bounds for `PORT`, `DB_PORT`, `DB_CONNECTION_LIMIT`, `BCRYPT_ROUNDS`, and `PASSWORD_RESET_EXPIRES_MINUTES`.
7. Added explicit server listen-error handling.
8. Expanded `npm run verify` to validate package scripts, required folder structure, all local source imports, and circular local dependencies.
9. Updated seed script so repeated runs refresh demo passwords and resume limits.

## Verification Results

- Dependency install state checked with `npm ls --depth=0`: passed.
- Missing dependency scan from source imports: passed by inspection and `npm ls`.
- Broken import/export check with `npm run verify`: passed.
- Circular dependency check with `npm run verify`: passed.
- JavaScript syntax check with `find src scripts -name '*.js' -exec node --check {} \;`: passed.
- Environment variable documentation check against `server/.env.example`: passed.
- Package script check with `npm pkg get scripts`: passed.
- Startup smoke test using an ephemeral local port: passed.
- Production dependency vulnerability audit with `npm audit --omit=dev`: passed with `0 vulnerabilities`.
- Migration command reached local MySQL but failed because credentials were rejected: `Access denied for user 'root'@'localhost'`.

## Remaining Risks

1. Migrations have not been applied on this machine because valid local MySQL credentials are not configured.
2. Password reset currently returns tokens in development because SMS delivery is not part of Phase 1.
3. JWT logout is stateless; clients must delete the token. Token revocation can be added later if a real security requirement appears.
4. Rate limits are in-memory, which is acceptable for a single-node MVP but should move to Redis only if the app runs on multiple instances.

## Manual Steps Required

1. Create `server/.env` from `server/.env.example`.
2. Configure valid MySQL credentials:

```bash
DB_USER=careervault_user
DB_PASSWORD=change_this_password
DB_NAME=careervault_ai
```

3. Run migrations and seeds:

```bash
cd server
npm run migrate
npm run seed
```

4. Start the backend:

```bash
npm run dev
```

5. Follow `TESTING_GUIDE.md` to test signup, phone-number login, JWT auth, profile update, forgot password, and reset password.
