import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";

export default function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
    </Router>
  );
}
