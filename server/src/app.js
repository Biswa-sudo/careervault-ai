const express = require('express');
const morgan = require('morgan');
const env = require('./config/env');
const { checkDatabase } = require('./db/pool');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { apiLimiter } = require('./middleware/rateLimiters');
const securityMiddleware = require('./middleware/security');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');

const app = express();

securityMiddleware(app);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

if (env.nodeEnv !== 'test') {
  app.use(morgan(env.logLevel));
}

app.use(apiLimiter);

app.get('/health', async (_req, res, next) => {
  try {
    const databaseOk = await checkDatabase();
    res.json({
      success: true,
      data: {
        service: 'CareerVault AI API',
        status: 'ok',
        database: databaseOk ? 'ok' : 'unavailable',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
