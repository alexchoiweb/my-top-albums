const updateList = async (dragData, listId) => {
  const httpHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${JSON.parse(
      localStorage.getItem("accessToken")
    )}`,
    Refreshtoken: JSON.parse(localStorage.getItem("refreshToken")),
  };

  const albumIds = dragData.rows["row-2"].albumIds;
  const savedAlbums = dragData.savedAlbums
  try {
    const body = { albumIds, savedAlbums };
    await fetch(`/api/list/${listId}`, {
      method: 'PUT',
      headers: httpHeaders,
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.log(err.message);
  }
}

export default updateList;