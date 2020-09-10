const Pool = require('pg').Pool;
require('dotenv').config();

// production
const pool = new Pool({
  host: 'database',
  port: 5432,
  user: 'user',
  password: 'pw',
  database: 'db'
})

module.exports = pool;
