import React from "react";
import { Redirect, Route } from "react-router-dom";

import isAuthenticated from "../Helpers/isAuthenticated";

const AuthRoute = ({ component: Component, path }) => {
  if (isAuthenticated()) {
    console.log("is authenticated");
    return <Route component={Component} path={path} />;
  } else {
    console.log("redirect");
    return <Redirect to="/login" />;
  }
};

export default AuthRoute;
