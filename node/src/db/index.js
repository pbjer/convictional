const { Pool } = require('pg');

const host = process.env.CONVICTIONAL_PG_HOST;
const database = process.env.CONVICTIONAL_PG_DATABASE;
const port = process.env.CONVICTIONAL_PG_PORT;
const user = process.env.CONVICTIONAL_PG_USER;
const password = process.env.CONVICTIONAL_PG_PASSWORD;

const missingConfig = [host, database, port, user, password].some((value) => !value);

if (missingConfig) {
  throw '\nMissing config for database connection!\n';
}

const pool = new Pool({
  host,
  database,
  port,
  user,
  password,
});

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  console.log('Executed query: ', { text, params });
  return res;
}

module.exports = { query };
