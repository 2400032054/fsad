import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");       // ✅ FIX
  const [password, setPassword] = useState(""); // ✅ FIX

  const handleLogin = async (e) => {
    e.preventDefault();

   console.log("Sending data:", { email, password }); // ✅ debug

    try {
      const data = await loginUser(email, password);

      alert("Login successful");

      // Redirect based on role
      if (data.role === 'admin') {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }

    } catch (err) {
      console.error("Login failed", err);
      alert(err.message); // shows the exact error from backend
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Email / Username:</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: "10px", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}>
          Login
        </button>

      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", color: "#555" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ fontWeight: "bold", color: "var(--color-primary)", textDecoration: "none" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;