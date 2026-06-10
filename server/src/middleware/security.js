const cors = require('cors');
const helmet = require('helmet');
const env = require('../config/env');
const AppError = require('../utils/AppError');

function securityMiddleware(app) {
  app.set('trust proxy', env.trustProxy);
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new AppError('CORS origin not allowed', 403));
      },
      credentials: true
    })
  );
}

module.exports = securityMiddleware;
