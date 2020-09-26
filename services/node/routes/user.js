const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

const generateAccessToken = (user) => { return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' }); }

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

// Register a new user
router.post('/api/register', async (req, res) => {
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
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      })
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

router.get('/api/confirmation/:token', authenticateEmailToken, async (req, res) => {
  const { email } = req.token
  const confirmUserEmailInDatabase = await pool.query('UPDATE users SET confirmed = true WHERE email = $1', [email]);
  res.redirect('/login')
})

// Login
router.post('/api/login', async (req, res) => {
  const data = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email])
  const user = data.rows[0];

  // Fail if user is not confirmed
  if (!user.confirmed) {
    console.log('User email is not confirmed')
  }

  if (user == null) return res.status(400).send('Cannot find email');

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      const saveToken = pool.query('INSERT INTO tokens (token) VALUES ($1)', [refreshToken])
      res.json({ accessToken: accessToken, refreshToken: refreshToken })
    } else {
      res.send('Wrong password');
    }
  } catch (err) {
    console.log(err)
    res.status(500).send();
  }
});

// Verify JWT / isLoggedIn
router.post('/api/isLoggedIn', async (req, res) => {
  const accessToken = JSON.parse(req.body.token);
  console.log(req.body.token)
  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        console.log(err)
        res.send('JWT not valid')
      }
      else {
        res.send({ isLoggedIn: true, user: user })
      }
    })
  } catch (err) {
    console.log(err)
  }
})

// Refresh Token
router.post('/api/refreshToken', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.sendStatus(401);
  const serverTokens = await pool.query("SELECT * FROM tokens");
  const tokenMatches = serverTokens.rows.filter((serverToken) => serverToken.token === refreshToken);
  const tokenExistsInDb = tokenMatches.length > 0;

  if (tokenExistsInDb) {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) { return res.sendStatus(403).send({ error: true, message: 'Invalid refresh token' }) }
      else {
        const accessToken = generateAccessToken({ user })
        res.json({ accessToken })
      }
    })
  } else {
    console.log('Refresh token does not exist in db')
    res.send(403);
  }
})

router.delete('/api/logout/:token', async (req, res) => {
  const data = await pool.query("DELETE FROM tokens WHERE token = $1", [req.params.token]);
})

module.exports = router;