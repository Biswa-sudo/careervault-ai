const env = require('../config/env');

function errorHandler(err, _req, res, _next) {
  const duplicateRecord = err.code === 'ER_DUP_ENTRY';
  const statusCode = duplicateRecord ? 409 : err.statusCode || 500;
  const isProduction = env.nodeEnv === 'production';

  if (!isProduction) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: duplicateRecord
      ? 'A record already exists with this unique value'
      : err.isOperational
        ? err.message
        : 'Internal server error',
    details: err.details,
    ...(isProduction ? {} : { stack: err.stack })
  });
}

module.exports = errorHandler;
