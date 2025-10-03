// lib/db.js
import pkg from 'pg';
const { Pool } = pkg;

// The pool will use the DATABASE_URL from the .env file automatically
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default {
  query: (text, params) => pool.query(text, params),
};