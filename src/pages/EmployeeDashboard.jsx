import React from "react";
import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Welcome Employee! This is your admin dashboard.</h2>
      </div>
    </>
  );
}
