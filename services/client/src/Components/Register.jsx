import React, { useState, useRef } from "react";

export default function Register() {
  const [username, setUsername] = useState("Terry");
  const [password, setPassword] = useState("McLaurin");
  const [passwordConfirm, setPasswordConfirm] = useState("McLaurin");
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      console.log("Passwords have to match");
    } else {
      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
    }
  };

  return (
    <div className="Register">
      <h1>Register Page</h1>

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
        <input
          ref={passwordConfirmRef}
          type="text"
          name="passwordConfirm"
          placeholder="confirm password"
          onChange={() => setPasswordConfirm(passwordConfirmRef.current.value)}
        ></input>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
