const fetchUserLists = (setLists, setLoading) => {
  const httpHeaders = {
    Authorization: `Bearer ${JSON.parse(
      localStorage.getItem("accessToken")
    )}`,
    Refreshtoken: JSON.parse(localStorage.getItem("refreshToken")),
  };

  const myHeaders = new Headers(httpHeaders);

  fetch("/api/lists", {
    method: "GET",
    headers: myHeaders,
  })
    .then((res) => res.json())
    .then((data) => {
      setLists(data);
      setLoading(false);
    })
    .catch((err) => console.log(err));

}

export default fetchUserLists;