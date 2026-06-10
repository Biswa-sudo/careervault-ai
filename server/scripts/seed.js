const bcrypt = require('bcryptjs');
const env = require('../src/config/env');
const { pool, query } = require('../src/db/pool');

const demoUsers = [
  {
    name: 'Aarav Sharma',
    phoneNumber: '+919876543210',
    email: 'aarav.jobseeker@example.com',
    password: 'Password123'
  },
  {
    name: 'Priya Nair',
    phoneNumber: '+919812345678',
    email: null,
    password: 'Password123'
  }
];

async function seedUsers() {
  for (const user of demoUsers) {
    const passwordHash = await bcrypt.hash(user.password, env.bcryptRounds);
    await query(
      `INSERT INTO users (name, email, phone_number, password_hash, subscription_status, subscription_plan, resume_limit)
       VALUES (:name, :email, :phoneNumber, :passwordHash, 'active', 'early_access', 5)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         email = VALUES(email),
         password_hash = VALUES(password_hash),
         subscription_status = VALUES(subscription_status),
         subscription_plan = VALUES(subscription_plan),
         resume_limit = VALUES(resume_limit),
         updated_at = CURRENT_TIMESTAMP`,
      {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        passwordHash
      }
    );
  }
}

async function run() {
  try {
    await seedUsers();
    console.log('Seed data inserted');
    console.log('Demo password for seeded users: Password123');
  } finally {
    await pool.end();
  }
}

run().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
