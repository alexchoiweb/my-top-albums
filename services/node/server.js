const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const nodemailer = require('nodemailer');
require('dotenv').config();
const router = require('./routes/user.js')

// middleware
app.use(cors());
app.use(express.json());

app.use(router);

console.log(`Server node environment is: ${process.env.NODE_ENV}`)

const generateAccessToken = (user) => { return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' }); }

const generateAccessTokenFromRefreshToken = async (refreshToken) => {
  if (refreshToken == null) return console.log('refresh token is null');
  const data = await pool.query("SELECT * FROM tokens");
  const serverTokens = data.rows

  const tokenExistsInDb = serverTokens.filter((serverToken) => serverToken.token === refreshToken);
  if (tokenExistsInDb.length === 0) {
    return console.log('Refresh token does not exist in db')
  } else {
    try {
      const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const newAccessToken = generateAccessToken({ user: user })
      return { user, newAccessToken };
    } catch (err) {
      console.log(err)
    }
  }
}

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const refreshToken = req.headers['refreshtoken'];
  const accessToken = authHeader && authHeader.split(' ')[1];
  if (accessToken == null) return res.sendStatus(401);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err && refreshToken) {
      const { user, newAccessToken } = await generateAccessTokenFromRefreshToken(refreshToken);
      req.user = user;
      console.log('got new access token')
      // save new access token in local storage
      next();
    } else if (err && refreshToken === undefined) {
      // accessToken failed and no refresh token passed: redirect user to /login
    }
    else {
      req.user = user;
      next();
    }
  })
}

//ROUTES
// Get user's lists
app.get('/api/lists', authenticateToken, async function (req, res) {
  const lists = await pool.query('SELECT * FROM lists WHERE user_id = $1', [req.user.user_id]);
  res.json(lists.rows)
})

// Get all users
app.get('/api/data', (request, response) => {
  let q = 'SELECT * FROM data';
  pool.query(q, (error, results) => {
    if (error) { throw error }
    response.status(200).json(results.rows)
  })
})

app.get('/', (request, response) => {
  response.json({ info: 'Server works, good job!' })
})

// Listen
// const PORT = process.env.PORT || 5001;
const PORT = 3001;

app.listen(PORT, () => console.log(`Server started on ${PORT}`))