import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Landing from "./Pages/Home";
import Lists from "./Pages/Lists";
import Login from "./Pages/Login";
import Edit from "./Pages/Edit";
import Register from "./Pages/Register";
import AuthRoute from "./Routes/AuthRoute";

export default function App() {
  const logout = () => {
    const token = JSON.parse(localStorage.getItem("refreshToken"));
    fetch(`/api/logout/${token}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => console.log(res));

    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    window.location = "/";
  };

  return (
    <Router>
      <div className="Nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/lists">Lists</Link>
          </li>
          <li>
            <Link to="/edit">Edit</Link>
          </li>
          <li
            onClick={() => {
              logout();
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <AuthRoute path="/edit" component={Edit} />
        <AuthRoute path="/lists" component={Lists} />
      </Switch>
    </Router>
  );
}

// use token to get User
// const [user, setUser] = useState(null);
// useEffect(() => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     console.log("fetch start");

//     fetch("/api/isLoggedIn", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ token }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         setUser(data.user);
//       })
//       .catch((err) => console.log(err));
//   }
// }, []);
