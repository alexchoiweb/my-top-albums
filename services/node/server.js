const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();
const router = require('./routes/user.js')

// middleware
app.use(cors());
app.use(express.json());

app.use(router);

console.log(`Server node environment is: ${process.env.NODE_ENV}`)

const isLoggedIn = (req, res, next) => {
  if (req.user) { next }
  else { console.log('no req.user!'); res.send(401, "Unauthorized") }
}

const generateAccessToken = (user) => { return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5s' }); }

const generateAccessTokenFromRefreshToken = async (refreshToken) => {
  if (refreshToken == null) return console.log('refresh token is null');
  const data = await pool.query("SELECT * FROM tokens");
  const serverTokens = data.rows

  const tokenExistsInDb = serverTokens.filter((serverToken) => serverToken.token === refreshToken);
  if (tokenExistsInDb.length === 0) {
    console.log('Refresh token does not exist in db')
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
      req.newAccessToken = newAccessToken
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

// Create new list
app.post('/api/lists/create', async (req, res) => {
  try {
    const insert = await pool.query(`INSERT INTO lists (user_id, title, album_ids, albums) VALUES ($1, $2, $3, $4)`, [req.body.user.user_id, 'New List', [], {}]);
    const userLists = await pool.query(`SELECT * FROM lists WHERE user_id = $1`, [req.body.user.user_id]);
    let newListId = 0;
    userLists.rows.map((list) => {
      if (list.list_id > newListId) newListId = list.list_id
    })
    res.send({ newListId })

  } catch (err) {
    console.log(err)
  }
})

// Update list by id
app.put('/api/list/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { savedAlbums, albumIds } = req.body;
    const updateList = await pool.query("UPDATE lists SET albums = $1, album_ids = $2 WHERE list_id = $3", [savedAlbums, albumIds, id]);
    res.json('List was updated')
  } catch (err) {
    console.error(err.message)
  }
})

// Delete list by id
app.delete('/api/lists/delete/:listId', async (req, res) => {
  try {
    const { listId } = req.params;
    const deleteList = await pool.query('DELETE from lists WHERE list_id = $1', [listId])
    res.json(`List ${listId} was deleted`)
  } catch (err) {
    console.log(err)
  }
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