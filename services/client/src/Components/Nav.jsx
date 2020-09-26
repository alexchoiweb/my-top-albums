import React from "react";

export default function Nav(props) {
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
    <div>
      <button
        onClick={() => {
          window.location = "/";
        }}
      >
        Home
      </button>
      <button
        onClick={() => {
          window.location = "/lists";
        }}
      >
        Lists
      </button>
      <button
        onClick={() => {
          window.location = "/login";
        }}
      >
        Login
      </button>
      <button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}
