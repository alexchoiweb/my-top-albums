import React from "react";

export default function Signup() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;
    const passwordConfirm = e.currentTarget.elements.passwordConfirm.value;
    if (password !== passwordConfirm) {
      console.log("password dont match");
      return;
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
  };

  return (
    <div className="Signup">
      <h1>Sign Up Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="email" required></input>
        <input
          type="text"
          name="password"
          placeholder="password"
          required
        ></input>
        <input
          type="text"
          name="passwordConfirm"
          placeholder="confirm password"
          required
        ></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
