const createList = (user, history) => {
  console.log(user)
  fetch('/api/lists/create', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user })
  }).then((res) => res.json())
    .then((data) => history.push(`/edit/${data.newListId}`))
    .catch((err) => console.log(err))
}

export default createList;