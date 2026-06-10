const mysql = require('mysql2/promise');
const env = require('../config/env');

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: env.db.connectionLimit,
  namedPlaceholders: true,
  timezone: 'Z'
});

async function query(sql, params = {}) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function checkDatabase() {
  const rows = await query('SELECT 1 AS ok');
  return rows[0]?.ok === 1;
}

module.exports = {
  pool,
  query,
  checkDatabase
};
