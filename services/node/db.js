const Pool = require('pg').Pool;
require('dotenv').config();

let pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    host: 'postgres-prod',
    port: 5432,
    user: 'user',
    password: 'pw',
    database: 'db'
  })
} else {
  pool = new Pool({
    host: 'postgres',
    port: 5432,
    user: 'user',
    password: 'pw',
    database: 'db'
  })
}

module.exports = pool;
