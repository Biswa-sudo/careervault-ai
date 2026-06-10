const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(name, fallback) {
  const value = process.env[name] || fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function numberValue(name, fallback, options = {}) {
  const raw = process.env[name] || fallback;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }
  if (options.integer && !Number.isInteger(parsed)) {
    throw new Error(`Environment variable ${name} must be an integer`);
  }
  if (options.min !== undefined && parsed < options.min) {
    throw new Error(`Environment variable ${name} must be at least ${options.min}`);
  }
  if (options.max !== undefined && parsed > options.max) {
    throw new Error(`Environment variable ${name} must be at most ${options.max}`);
  }
  return parsed;
}

function booleanOrNumber(name, fallback = 'false') {
  const raw = process.env[name] || fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be true, false, or a number`);
  }
  return parsed;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: numberValue('PORT', '5000', { integer: true, min: 1, max: 65535 }),
  db: {
    host: required('DB_HOST', '127.0.0.1'),
    port: numberValue('DB_PORT', '3306', { integer: true, min: 1, max: 65535 }),
    user: required('DB_USER', 'root'),
    password: process.env.DB_PASSWORD || '',
    database: required('DB_NAME', 'careervault_ai'),
    connectionLimit: numberValue('DB_CONNECTION_LIMIT', '10', { integer: true, min: 1 })
  },
  jwt: {
    secret: required('JWT_SECRET', 'development-secret-change-before-production'),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  bcryptRounds: numberValue('BCRYPT_ROUNDS', '12', { integer: true, min: 10, max: 15 }),
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  trustProxy: booleanOrNumber('TRUST_PROXY', 'false'),
  logLevel: process.env.LOG_LEVEL || 'dev',
  passwordResetExpiresMinutes: numberValue('PASSWORD_RESET_EXPIRES_MINUTES', '30', {
    integer: true,
    min: 5,
    max: 1440
  })
};

if (env.nodeEnv === 'production' && env.jwt.secret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters in production');
}

module.exports = env;
