import React from "react";

export default function Login(props) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
      props.setUser(data.user);
      props.history.push("/lists");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="Login">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="email"
          // value="email"
        ></input>
        <input
          type="text"
          name="password"
          placeholder="password"
          // value="pw"
        ></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
