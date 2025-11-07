import React from "react";
import Navbar from "../components/Navbar"; // <- Make sure this path matches your folder structure
import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const employeeName = localStorage.getItem("userName"); // or "employeeName" if you stored it separately

  return (
    <>
      <Navbar employeeName={employeeName} />
      <div className="container">
        <h2>Welcome Employee! This is your admin dashboard.</h2>
      </div>
    </>
  );
}
