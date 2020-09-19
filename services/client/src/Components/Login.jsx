import React, { useState, useRef } from "react";

export default function Login(props) {
  const [username, setUsername] = useState("Josh");
  const [password, setPassword] = useState("Allen");
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((res) => res.json())
      .then((data) => localStorage.setItem("tokens", JSON.stringify(data)))
      .catch((err) => console.log(err));

    console.log(localStorage);
    props.history.push("/lists");
  };

  return (
    <div className="Login">
      <h1>Login Page</h1>

      <form onSubmit={submitHandler}>
        <input
          ref={usernameRef}
          type="text"
          name="username"
          placeholder="username"
          onChange={() => setUsername(usernameRef.current.value)}
        ></input>
        <input
          ref={passwordRef}
          type="text"
          name="password"
          placeholder="password"
          onChange={() => setPassword(passwordRef.current.value)}
        ></input>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
