# Testing Guide

This guide covers the Phase 1 backend only. There is no frontend or resume builder in this phase.

## Prerequisites

- Node.js 18+
- npm
- MySQL 8+
- Valid database credentials in `server/.env`

## Setup

```bash
cd server
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run verify
npm run dev
```

If MySQL rejects the default credentials, edit these values in `server/.env`:

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=careervault_user
DB_PASSWORD=change_this_password
DB_NAME=careervault_ai
```

## Health Check

```bash
curl http://localhost:5000/health
```

Expected result: `success` is `true` and `database` is `ok`.

## Signup

```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Mehta",
    "phoneNumber": "+919900001111",
    "email": "rahul@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

Expected result: response includes `data.accessToken` and `data.user.phoneNumber`.

## Login With Phone Number

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919900001111",
    "password": "Password123"
  }'
```

Save the returned token:

```bash
TOKEN="paste-access-token-here"
```

## Current User

```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Update Profile

```bash
curl -X PATCH http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul M.",
    "phoneNumber": "+919900001111",
    "email": ""
  }'
```

Expected result: email can be `null` because it is optional.

## Forgot Password

```bash
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919900001111"
  }'
```

In development, the response includes `data.resetToken`. In production, the token is not returned and should be delivered through an SMS provider when that integration is added.

## Reset Password

```bash
curl -X POST http://localhost:5000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "paste-reset-token-here",
    "password": "NewPassword123",
    "confirmPassword": "NewPassword123"
  }'
```

## Seeded Users

After `npm run seed`, these phone numbers are available:

- `+919876543210`
- `+919812345678`

Both use password `Password123`.

## Negative Tests

- Signup with an already registered phone number should return `409`.
- Login with a wrong password should return `401`.
- Access `/api/v1/auth/me` without a token should return `401`.
- Send an invalid phone number and validation should return `422`.
- Call unknown routes and the API should return `404`.

## Verification Commands

```bash
cd server
npm run verify
find src scripts -name '*.js' -exec node --check {} \;
npm run migrate
```
