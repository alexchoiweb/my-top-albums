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
    const insert = await pool.query(`INSERT INTO lists (user_id, title) VALUES ($1, $2)`, [req.body.user.user_id, 'New List']);
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

// Get list
app.get('/api/lists/:id', authenticateToken, async function (req, res) {
  const { id } = req.params
  const title = await pool.query('SELECT title FROM lists WHERE list_id = $1', [id])
  const list = await pool.query('SELECT a.album_id, title, artist, url FROM albums a INNER JOIN list_album l on a.album_id = l.album_id WHERE list_id = $1 ORDER BY ordering', [id])
  res.json([list.rows, title.rows[0]])
})

// Update list by id
app.put('/api/list/:listId', authenticateToken, async (req, res) => {
  try {
    const { listId } = req.params;
    let { albumIds, savedAlbums } = req.body;
    const oldIds = await pool.query('SELECT a.album_id FROM albums a INNER JOIN list_album l on a.album_id = l.album_id WHERE list_id = $1 ORDER BY ordering', [listId])

    // delete old list_albums and add new list_album records
    let mergedIds = {};
    oldIds.rows.map(id => { const oldId = id['album_id']; mergedIds[oldId] = 1 });
    albumIds.map((id) => {
      if (mergedIds[id]) {
        mergedIds[id] = 0
      } else if (!mergedIds[id]) {
        mergedIds[id] = 2;
      }
    })

    console.log(`Old ids ${albumIds}`);

    for (let id in mergedIds) {
      if (mergedIds[id] === 1) { // album was deleted from list
        pool.query('DELETE FROM list_album WHERE album_id = $1 AND list_id = $2', [id, listId])
      } else if (mergedIds[id] === 2) { // album is new to list
        const { url, title, artist } = savedAlbums[id];
        const orderingPlaceholder = 0;
        const albumRecordExists = await pool.query('SELECT * FROM albums WHERE title=$1 AND artist = $2', [title, artist]);
        if (albumRecordExists.rows.length > 0) { // album is already saved in albums db => get saved album's id
          const existingAlbumId = albumRecordExists.rows[0].album_id;
          for (let i = 0; i < albumIds.length; i++) {
            if (albumIds[i] == id) { albumIds[i] = existingAlbumId; }
          }
          await pool.query('INSERT INTO list_album (album_id, list_id, ordering) VALUES ($1, $2, $3)', [existingAlbumId, listId, orderingPlaceholder])
        } else { //album is not saved yet in albums db
          await pool.query('INSERT INTO albums (album_id, url, title, artist) VALUES ($1, $2, $3, $4)', [id, url, title, artist])
          await pool.query('INSERT INTO list_album (album_id, list_id, ordering) VALUES ($1, $2, $3)', [id, listId, 0])
        }
      }
    }
    console.log(`New ids ${albumIds}`);

    // set order of list_album records
    await pool.query(`
      UPDATE list_album
      SET ordering = new_order
      FROM unnest($1::text[]) WITH ORDINALITY AS xyz(album_id, new_order)
      WHERE list_id = $2
      AND list_album.album_id = xyz.album_id;
      `, [albumIds, listId])

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