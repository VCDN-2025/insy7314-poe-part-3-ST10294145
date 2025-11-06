import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // Not logged in
    return <Navigate to="/" />;
  }

  if (allowedRole && role !== allowedRole) {
    // Logged in but wrong role
    return <Navigate to="/" />;
  }

  // Authorized
  return children;
}
