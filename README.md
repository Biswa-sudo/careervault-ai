# CareerVault AI

Cloud-based career document management platform for resumes and career documents.

Current stage: MVP development.

## Phase 1 Backend

### Linux/Chromebook Local Setup

Install Node.js 18+ and MySQL 8+ first. On Debian/Ubuntu/Crostini:

```bash
sudo apt update
sudo apt install -y nodejs npm mysql-server
node --version
npm --version
mysql --version
```

Create a MySQL database user if you do not want to use `root`:

```bash
sudo mysql
```

```sql
CREATE DATABASE careervault_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'careervault_user'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT ALL PRIVILEGES ON careervault_ai.* TO 'careervault_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Configure and run the backend:

```bash
cd server
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

Edit `server/.env` before running migrations if your MySQL username or password differs from the defaults.

Health check:

```bash
curl http://localhost:5000/health
```

API base path: `/api/v1`.

## Phase 1 API

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/auth/me`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`

## Verification

```bash
cd server
npm run verify
node -e "require('./src/app'); console.log('app loaded')"
find src scripts -name '*.js' -exec node --check {} \;
```

Phone number is the primary login credential. Email is optional profile data.
