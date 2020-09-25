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
    window.location = "/login";
  };
  return (
    <div>
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
