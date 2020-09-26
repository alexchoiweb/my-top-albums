import React, { useState } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Landing from "./Pages/Landing";
import Lists from "./Pages/Lists";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(isLoggedIn);
  const token = localStorage.getItem("accessToken");

  if (token) {
    fetch(`/api/isLoggedIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(data.isLoggedIn));
  }

  return (
    <Router>
      <Route exact path="/" component={Landing} />
      <Route path="/login" component={Login} isLoggedIn={isLoggedIn} />
      <Route path="/register" component={Register} />
      <Route path="/lists" component={Lists} />
    </Router>
  );
}
