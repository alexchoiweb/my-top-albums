const fetchList = async (listId) => {
  listId = Number(listId)
  const httpHeaders = {
    Authorization: `Bearer ${JSON.parse(
      localStorage.getItem("accessToken")
    )}`,
    Refreshtoken: JSON.parse(localStorage.getItem("refreshToken")),
  };
  const myHeaders = new Headers(httpHeaders);

  try {
    const response = await fetch(`/api/lists/${listId}`, {
      method: "GET",
      headers: myHeaders,
    });
    const data = await response.json()
    const title = data[1].title;
    const list = data[0]
    return { list, title };
  } catch (err) {
    console.log(err);
  }
}

export default fetchList;