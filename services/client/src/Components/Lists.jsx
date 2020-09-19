import React, { useState, useEffect } from "react";

const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${JSON.parse(localStorage.getItem("tokens")).accessToken}`
  );

  useEffect(() => {
    fetch("/api/lists", {
      method: "GET",
      headers: myHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return { data, loading };
};

export default function Lists() {
  const { data, loading } = useFetch();
  const lists = data;

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
