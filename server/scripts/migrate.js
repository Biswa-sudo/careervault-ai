const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');
const env = require('../src/config/env');

const migrationsDir = path.resolve(__dirname, '../../database/migrations');

function escapeIdentifier(identifier) {
  return `\`${String(identifier).replace(/`/g, '``')}\``;
}

async function createConnection(database = undefined) {
  return mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database,
    multipleStatements: true,
    timezone: 'Z'
  });
}

async function ensureDatabase() {
  const connection = await createConnection();
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS ${escapeIdentifier(env.db.database)}
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.end();
}

async function ensureMigrationsTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      filename VARCHAR(255) NOT NULL,
      executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_migrations_filename (filename)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function getAppliedMigrations(connection) {
  const [rows] = await connection.query('SELECT filename FROM migrations');
  return new Set(rows.map((row) => row.filename));
}

async function run() {
  await ensureDatabase();
  const connection = await createConnection(env.db.database);

  try {
    await ensureMigrationsTable(connection);
    const applied = await getAppliedMigrations(connection);
    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipping ${file}`);
        continue;
      }

      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
      await connection.beginTransaction();
      try {
        await connection.query(sql);
        await connection.query('INSERT INTO migrations (filename) VALUES (?)', [file]);
        await connection.commit();
        console.log(`Applied ${file}`);
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    }

    console.log('Migrations complete');
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
