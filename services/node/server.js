const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

console.log(`Server node environment is: ${process.env.NODE_ENV}`)

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) { console.log(err); return res.sendStatus(403) };
    req.user = user;
    next();
  })
}

const generateAccessToken = (user) => { return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }); }

//ROUTES
// Get user by username by logged in user (with JWT)
app.get('/api/users', authenticateToken, async function (req, res) {
  const users = await pool.query('SELECT * FROM users WHERE username=$1', [req.user.username])
  res.json(
    users.rows
  );
});

app.get('/api/allusers', async function (req, res) {
  const users = await pool.query('SELECT * FROM users');
  res.json(users.rows)
});

const users = []

// Get user's lists
app.get('/api/lists', authenticateToken, async function (req, res) {
  const lists = await pool.query('SELECT * FROM lists WHERE username = $1', [req.user.username]);
  res.json(lists.rows)
})

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const username = req.body.username
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await pool.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [username, hashedPassword]);
    res.send('New user created')
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
})

// Login
app.post('/api/login', async (req, res) => {
  const data = await pool.query("SELECT * FROM users WHERE username = $1", [req.body.username])
  const user = data.rows[0];

  if (user == null) return res.status(400).send('Cannot find user');

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      res.json({ accessToken: accessToken, refreshToken: refreshToken })
    } else {
      res.send('Not Allowed');
    }
  } catch (err) {
    console.log(err)
    res.status(500).send();
  }
})

let refreshTokens = [];

// Refresh Token
app.post('/api/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.username })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/api/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token != req.body.token);
  res.sendStatus(204);
})









// GET USERS
app.get('/api/data', (request, response) => {
  let q = 'SELECT * FROM data';
  pool.query(q, (error, results) => {
    if (error) { throw error }
    response.status(200).json(results.rows)
  })
})

// CREATE USER
app.post('/api/data', async (req, res) => {
  try {

    const newUser = await pool.query(`INSERT INTO data (data) VALUES ('New User')`);

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})

app.get('/', (request, response) => {
  response.json({ info: 'Server works, good job!' })
})

// Listen
// const PORT = process.env.PORT || 5001;
const PORT = 3001;

app.listen(PORT, () => console.log(`Server started on ${PORT}`))