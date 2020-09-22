import React from "react";

export default function Nav() {
  const logout = () => console.log("logged out");

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
