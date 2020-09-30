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
    const response = await fetch("/api/lists", {
      method: "GET",
      headers: myHeaders,
    });
    const data = await response.json()
    const requestedList = data.filter((list) => list.list_id === Number(listId));
    console.log(requestedList);
    return requestedList[0];
  } catch (err) {
    console.log(err);
  }
}

export default fetchList;