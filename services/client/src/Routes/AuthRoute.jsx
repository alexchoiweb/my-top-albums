import React from "react";
import { Redirect, Route } from "react-router-dom";

import isAuthenticated from "../Helpers/isAuthenticated";

const AuthRoute = ({ component: Component, path, user }) => {
  if (isAuthenticated()) {
    return (
      <Route
        render={(props) => <Component {...props} user={user} />}
        path={path}
      />
    );
  } else {
    console.log("Pls log in.");
    return <Redirect to="/login" />;
  }
};

export default AuthRoute;
