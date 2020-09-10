const initialData = {
  albums: {
    '6238b4ad-7a8b-47df-9045-37a4edd6c81b': { id: '6238b4ad-7a8b-47df-9045-37a4edd6c81b', url: "https://lastfm.freetls.fastly.net/i/u/174s/86b35c4eb3c479da49c915d8771bbd1a.png", title: 'To Pimp a Butterfly', artist: 'Kendrick Lamar' },
  },
  savedAlbums: {
    'album-1': { id: 'album-1', url: "https://lastfm.freetls.fastly.net/i/u/174s/8a59ed3a9c71cb5113325e2026889e4a.png", title: 'D.A.M.N.', artist: 'Kendrick Lamar' },
  },
  rows: {
    'row-1': {
      id: 'row-1',
      title: 'Search Results',
      albumIds: ['6238b4ad-7a8b-47df-9045-37a4edd6c81b']
    },
    'row-2': {
      id: 'row-2',
      title: 'My Albums',
      albumIds: ['album-1']
    },
  },
  rowOrder: ['row-1', 'row-2']
}

export default initialData;