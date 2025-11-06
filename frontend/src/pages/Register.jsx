import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Register.css"; 

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { name, email, password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 1000); // Redirect after 1s
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering");
    }
  };

  return (
    
<div className="register-container">
  <h2>Register (Users Only)</h2>
  <form onSubmit={handleRegister}>
    <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
    <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
    <button type="submit">Register</button>
  </form>
  {message && <p>{message}</p>}
  <p>Already have an account? <span onClick={() => navigate("/")}>Login</span></p>
</div>

  );
}
