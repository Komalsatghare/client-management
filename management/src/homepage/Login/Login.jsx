import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    localStorage.setItem("authToken", "demo-token");
    navigate("/dashboard");
  };

  // Inline CSS styles
  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f3f3",
    padding: "20px",
    boxSizing: "border-box",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  };

  const titleStyle = {
    fontSize: "1.8rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#555",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    fontSize: "1rem",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    marginBottom: "20px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const buttonHover = (e) => {
    e.currentTarget.style.backgroundColor = "#0056b3";
  };

  const buttonLeave = (e) => {
    e.currentTarget.style.backgroundColor = "#007bff";
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label style={labelStyle} htmlFor="username">
              Username
            </label>
            <input
              style={inputStyle}
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="password">
              Password
            </label>
            <input
              style={inputStyle}
              id="password"
              type="password"
              placeholder="******************"
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={buttonHover}
            onMouseLeave={buttonLeave}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
