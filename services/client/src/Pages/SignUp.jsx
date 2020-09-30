import React, { useState, useRef } from "react";

export default function Register() {
  const [email, setEmail] = useState("asdf");
  const [password, setPassword] = useState("asdf");
  const [passwordConfirm, setPasswordConfirm] = useState("asdf");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      console.log("Passwords have to match");
    } else {
      fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
    }
    //redirect to login
  };

  return (
    <div className="Register">
      <h1>Sign Up Page</h1>

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
