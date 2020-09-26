import React, { useState, useEffect } from "react";

export default function Lists() {
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

  return (
    <div className="Lists">
      <h1>Lists Page</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {lists.map((lists, index) => (
            <h2 key={index}>{lists.content}</h2>
          ))}
        </div>
      )}
    </div>
  );
}
