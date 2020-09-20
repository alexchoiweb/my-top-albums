import React, { useState, useRef } from "react";

export default function Login(props) {
  const [email, setEmail] = useState("email");
  const [password, setPassword] = useState("pw");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      console.log(email, password);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      console.log(data);
      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));

      props.history.push("/lists");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="Login">
      <h1>Login Page</h1>

      <form onSubmit={submitHandler}>
        <input
          ref={emailRef}
          type="text"
          name="email"
          placeholder="email"
          onChange={() => setEmail(emailRef.current.value)}
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
