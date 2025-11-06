import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
        <h1 className="logo">Credify</h1>
      </div>

      <div className="nav-center">
        <Link to="/user" className="nav-link">User Dashboard</Link>
        <Link to="/employee" className="nav-link">Employee Dashboard</Link>
        <Link to="/swift" className="nav-link">SWIFT</Link>
      </div>

      <div className="nav-right">
        <span className="user-label">{employeeName || userName}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
