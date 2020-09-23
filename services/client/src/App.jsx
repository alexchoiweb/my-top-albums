import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Pages/Home";
import Lists from "./Pages/Lists";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

export default function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/lists" component={Lists} />
    </Router>
  );
}
