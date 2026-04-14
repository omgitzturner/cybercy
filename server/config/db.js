const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

// Test connection at startup
async function validateConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', result.rows[0].now);
  } catch (err) {
    console.error('❌ Database connection failed!');
    console.error('Error:', err.message);
    console.error('\nCheck your DATABASE_URL in .env:');
    console.error('- Is the password correct?');
    console.error('- Does the database "cybertraining" exist?');
    console.error('- Is PostgreSQL running on localhost:5432?');
    process.exit(1);
  }
}

validateConnection();

module.exports = pool;