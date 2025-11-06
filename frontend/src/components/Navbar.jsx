import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ employeeName, userName }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="logo">🌍 SwiftPay</h1>
      </div>

      <div className="nav-center">
        <a href="/user" className="nav-link">User Dashboard</a>
        <a href="/employee" className="nav-link">Employee Dashboard</a>
        <a href="/swift" className="nav-link">SWIFT</a>
      </div>

      <div className="nav-right">
        <span className="user-label">
          {employeeName || userName}
        </span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}


