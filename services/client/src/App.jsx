import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Landing from "./Pages/Home";
import Lists from "./Pages/Lists";
import Login from "./Pages/Login";
import Edit from "./Pages/Edit";
import SignUp from "./Pages/SignUp";
import AuthRoute from "./Routes/AuthRoute";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetch("/api/isLoggedIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <Router>
      {user && <span>{user.user_id}</span>}
      <Navbar user={user} />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route
          path="/login"
          render={(props) => <Login {...props} setUser={setUser} />}
        />
        <Route path="/signup" component={SignUp} />
        <AuthRoute path="/edit" component={Edit} />
        <AuthRoute path="/lists" component={Lists} />
      </Switch>
    </Router>
  );
}
