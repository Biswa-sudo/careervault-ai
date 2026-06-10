const app = require('./app');
const env = require('./config/env');
const { pool } = require('./db/pool');

const server = app.listen(env.port, () => {
  console.log(`CareerVault AI API running on port ${env.port}`);
});

server.on('error', (error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`);
  const forceExit = setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);

  server.close(async (error) => {
    clearTimeout(forceExit);
    if (error) {
      console.error('Error while closing server:', error);
      process.exit(1);
    }
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  shutdown('unhandledRejection');
});
