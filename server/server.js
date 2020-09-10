const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

//ROUTES
// GET USERS
app.get('/data', (request, response) => {
  let q = 'SELECT * FROM data';
  pool.query(q, (error, results) => {
    if (error) { throw error }
    response.status(200).json(results.rows)
  })
})

// CREATE USER
app.post('/data', async (req, res) => {
  try {

    const newUser = await pool.query(`INSERT INTO data (data) VALUES ('New User')`);

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})

app.get('/', (request, response) => {
  response.json({ info: 'It works very good jobsssss!' })
})

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`))