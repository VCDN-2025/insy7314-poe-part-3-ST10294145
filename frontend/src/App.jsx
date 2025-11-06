import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SwiftPage from "./pages/SwiftPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");
  const employeeName = localStorage.getItem("employeeName");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Navbar userName={userName} />
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <Navbar employeeName={employeeName} />
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/swift"
          element={
            <ProtectedRoute allowedRoles={["user", "employee"]}>
              <Navbar employeeName={employeeName} userName={userName} />
              <SwiftPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
