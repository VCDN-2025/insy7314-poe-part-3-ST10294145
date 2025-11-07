import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

    console.log("🔑 Login attempt:", { email });

    try {
      const response = await axios.post(
        "https://localhost:5000/api/auth/login",
        { email, password },
        { 
          headers: { "Content-Type": "application/json" },
          withCredentials: true 
        }
      );

      console.log("✅ Login response:", response.data);

      if (response.data.success) {
        const { token, user } = response.data;

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userId", user.id);

        console.log("✅ Saved to localStorage:", {
          token: token.substring(0, 20) + "...",
          role: user.role,
          userName: user.name,
          userId: user.id
        });

        // Navigate based on role
        if (user.role === "employee") {
          console.log("✅ Redirecting to /swift (employee)");
          navigate("/swift");
        } else {
          console.log("✅ Redirecting to /dashboard (user)");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          {error && (
            <div style={styles.error}>
              ❌ {error}
            </div>
          )}

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={styles.hint}>
          <p><strong>Test Accounts:</strong></p>
          <p>👤 User: user@test.com / password123</p>
          <p>👨‍💼 Employee: employee@test.com / password123</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "20px"
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px"
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
    fontSize: "28px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontWeight: "600",
    color: "#555",
    fontSize: "14px"
  },
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
    transition: "border-color 0.3s"
  },
  button: {
    padding: "14px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s"
  },
  error: {
    padding: "12px",
    backgroundColor: "#fee",
    color: "#c33",
    borderRadius: "6px",
    fontSize: "14px",
    border: "1px solid #fcc"
  },
  hint: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.6"
  }
};

export default Login;