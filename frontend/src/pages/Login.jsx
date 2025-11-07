import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // make sure this path matches your file structure

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://localhost:5000/api/auth/login",
        { email, password },
        { 
          headers: { "Content-Type": "application/json" },
          withCredentials: true 
        }
      );

      if (response.data.success) {
        const { token, user } = response.data;

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userId", user.id);

        // Navigate based on role
        if (user.role === "employee") {
          navigate("/swift");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else if (err.request) {
        setError("Cannot connect to server. Is the backend running?");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">🔐 Login</h2>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error">❌ {error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="hint">
          <p><strong>Test Accounts:</strong></p>
          <p>👤 User: user@test.com / password123</p>
          <p>👨‍💼 Employee: employee@test.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
