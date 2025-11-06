import React from "react";
import "./UserDashboard.css";

export default function UserDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
<div className="container">
  <h2>Welcome User! This is your dashboard.</h2>
  <button onClick={handleLogout}>Logout</button>
</div>
  );
}
