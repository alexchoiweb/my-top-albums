import React from "react";
import { Link } from "react-router-dom";

export default function Nav(props) {
  const { user } = props;

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
    <div className="Nav">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {user ? null : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
        {user ? null : (
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        )}

        {user && (
          <li>
            <Link to="/lists">Lists</Link>
          </li>
        )}
        {user ? (
          <li
            onClick={() => {
              logout();
            }}
          >
            Logout
          </li>
        ) : null}
      </ul>
    </div>
  );
}
