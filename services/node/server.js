const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const nodemailer = require('nodemailer');
require('dotenv').config();



// middleware
app.use(cors());
app.use(express.json());

console.log(`Server node environment is: ${process.env.NODE_ENV}`)

const generateAccessToken = (user) => { return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }); }

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) { console.log(err); return res.sendStatus(403) }
    else {
      req.user = user;
      next();
    }
  })
}

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
  const lists = await pool.query('SELECT * FROM lists WHERE user_id = $1', [req.user.user_id]);
  res.json(lists.rows)
})


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
})

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const email = req.body.email
    const usedEmails = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let emailInUse;
    usedEmails.rows.length === 0 ? emailInUse = false : emailInUse = true;
    if (emailInUse) {
      res.send('Email already in use')
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await pool.query(`INSERT INTO users (email, password, confirmed) VALUES ($1, $2, false)`, [email, hashedPassword]);

      // send confirmation email
      const emailToken = jwt.sign({ email: email }, process.env.EMAIL_SECRET, { expiresIn: '1d' }, (err, emailToken) => {
        const url = `http://localhost/api/confirmation/${emailToken}`
        const mailOptions = {
          from: 'oolongloop@gmail.com',
          to: email,
          subject: 'Confirm your email address for my-top-albums',
          html: `<h2>Thanks for joining my-top-albums!</h2><a href="${url}">Please click this link to confirm your email</a>`
        };
        transporter.sendMail(mailOptions, (err, data) => {
          if (err) { console.log(err) }
          else { console.log('Email sent') }
        })

      })

      res.send('New user created')
      res.status(201).send();
    }
  } catch {
    res.status(500).send();
  }
})

const authenticateEmailToken = (req, res, next) => {
  const token = req.params.token;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.EMAIL_SECRET, (err, email) => {
    if (err) { console.log(err); return res.sendStatus(403) } else {
      req.token = email;
      next();
    }
  })
}

app.get('/api/confirmation/:token', authenticateEmailToken, async (req, res) => {
  const { email } = req.token
  const confirmUser = await pool.query('UPDATE users SET confirmed = true WHERE email = $1', [email]);
  res.redirect('/login')
})

// Login
app.post('/api/login', async (req, res) => {
  const data = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email])
  const user = data.rows[0];

  // Fail if user is not confirmed
  console.log(user.confirmed);

  if (user == null) return res.status(400).send('Cannot find email');

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      res.json({ accessToken: accessToken, refreshToken: refreshToken })
    } else {
      res.send('Wrong password');
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