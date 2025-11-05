import React from "react";

export default function UserDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div>
      <h2>Welcome User! This is your dashboard.</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
