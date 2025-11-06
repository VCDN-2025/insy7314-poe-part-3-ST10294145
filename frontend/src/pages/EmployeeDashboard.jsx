import React from "react";
import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="container">
      <h2>Welcome Employee! This is your admin dashboard.</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
