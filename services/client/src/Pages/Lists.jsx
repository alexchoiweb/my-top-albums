import React, { useState, useEffect } from "react";

export default function Lists(props) {
  const [lists, setLists] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.log(data);
        setLists(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const goToEdit = (listId) => {
    props.history.push({ pathname: `edit/${listId}` });
  };

  return (
    <div className="Lists">
      <h1>Lists Page</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {lists.map((list, index) => (
            <h2 key={index} onClick={() => goToEdit(list.list_id)}>
              {list.list_id}: {list.content}
            </h2>
          ))}
        </div>
      )}
    </div>
  );
}
