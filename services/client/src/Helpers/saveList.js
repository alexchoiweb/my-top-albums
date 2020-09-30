const saveList = async (dragData, listId) => {
  const albumIds = dragData.rows["row-2"].albumIds;
  const savedAlbums = dragData.savedAlbums
  try {
    const body = { albumIds, savedAlbums };
    const response = await fetch(`/api/list/${listId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    console.log('success')
    console.log(response)
  } catch (err) {
    console.log(err.message);
  }
}

export default saveList;