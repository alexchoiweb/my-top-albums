CREATE TABLE users (
  user_id SERIAL NOT NULL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(150) NOT NULL,
  lists INT[]
);

CREATE TABLE data (
  user_id SERIAL NOT NULL PRIMARY KEY,
  data TEXT
);

INSERT INTO data (data) VALUES ('Local User');

INSERT INTO users (
  username,
  first_name,
  last_name,
  email,
  lists
) VALUES ('UserPrime', 'Numero', 'Uno', 'imreallyfirst@gmail.com', ARRAY [1,2]);

CREATE TABLE lists (
  list_id SERIAL NOT NULL PRIMARY KEY,
  user_id INT NOT NULL,
  list_title VARCHAR(50),
  albums jsonb,
  album_ids VARCHAR[],
  
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
	    REFERENCES users(user_id)
);

INSERT INTO lists (user_id, list_title, albums, album_ids) VALUES (
  '1',
  'Best Tracks to Listen to While Sleeping',
  '[{"album-1": {
      "id": "album-1",
      "url": "https://lastfm.freetls.fastly.net/i/u/174s/8a59ed3a9c71cb5113325e2026889e4a.png",
      "title": "D.A.M.N.",
      "artist":"Kendrick Lamar"
    }},
    {"album-2": {
      "id": "album-2",
      "url": "https://lastfm.freetls.fastly.net/i/u/174s/c6ce2102cff33f954b3e7ef288a7c994.png",
      "title": "A Decade Of Steely Dan",
      "artist":"Steely Dan"
    }}
  ]',
  ARRAY ['album-2', 'album-1']
);

  -- savedAlbums: {
  --   'album-1': {
    -- id: 'album-1',
    -- url: "https://lastfm.freetls.fastly.net/i/u/174s/8a59ed3a9c71cb5113325e2026889e4a.png",
    -- title: 'D.A.M.N.',
    -- artist:'Kendrick Lamar'
    },
  -- },