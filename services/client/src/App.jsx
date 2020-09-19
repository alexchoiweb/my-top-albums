import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Lists from "./Components/Lists";

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
