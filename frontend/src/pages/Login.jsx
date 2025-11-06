import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      const { role, token, userName } = res.data;  //Get userName from response

      // Save userName to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userName", userName);  

      console.log("✅ Login successful! User:", userName);

      // Redirect based on role
      if (role === "employee") {
        localStorage.setItem("employeeName", userName);  
        navigate("/employee");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div className="form-group">
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="register-text">
          Don't have an account?{" "}
          <span className="register-link" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </section>
    </main>
  );
}