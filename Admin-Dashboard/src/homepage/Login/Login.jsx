import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Eye, EyeOff, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Securely store the real token
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("adminUsername", data.admin.username || "");
        localStorage.setItem("adminName", data.admin.name || "");
        localStorage.setItem("adminEmail", data.admin.email || "");
        localStorage.setItem("adminPhone", data.admin.phone || "");

        navigate("/admin-dashboard");
      } else {
        // Invalid credentials or other errors
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
                    .login-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
                        font-family: 'Inter', 'Poppins', sans-serif;
                        padding: 1rem;
                    }

                    .login-card {
                        max-width: 28rem;
                        width: 100%;
                        border-top: 4px solid #10b981;
                        background-color: #1e293b;
                        border-radius: 1rem;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                        padding: 2.5rem;
                        transition: all 0.3s ease;
                    }

                    .login-card:hover {
                        transform: scale(1.01);
                    }

                    .login-header {
                        text-align: center;
                        margin-bottom: 2rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .login-logo {
                        background-color: rgba(16, 185, 129, 0.1);
                        padding: 0.75rem;
                        border-radius: 50%;
                        margin-bottom: 1rem;
                        box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
                        border: 1px solid rgba(16, 185, 129, 0.3);
                        color: #34d399;
                    }

                    .login-title {
                        font-size: 1.875rem;
                        font-weight: 800;
                        color: #ffffff;
                        margin: 0;
                        letter-spacing: -0.025em;
                    }

                    .login-subtitle {
                        font-size: 0.875rem;
                        color: #94a3b8;
                        margin-top: 0.5rem;
                        font-weight: 500;
                    }

                    .login-error {
                        margin-bottom: 1.5rem;
                        padding: 0.75rem;
                        background-color: rgba(239, 68, 68, 0.1);
                        border: 1px solid rgba(239, 68, 68, 0.5);
                        border-radius: 0.5rem;
                        display: flex;
                        align-items: center;
                        color: #ef4444;
                        font-size: 0.875rem;
                        font-weight: 500;
                    }

                    .login-form {
                        display: flex;
                        flex-direction: column;
                        gap: 1.25rem;
                    }

                    .input-group {
                        display: flex;
                        flex-direction: column;
                    }

                    .input-label {
                        display: block;
                        font-size: 0.875rem;
                        font-weight: 500;
                        color: #cbd5e1;
                        margin-bottom: 0.25rem;
                    }

                    .input-wrapper {
                        position: relative;
                        display: flex;
                        align-items: center;
                    }

                    .input-icon {
                        position: absolute;
                        left: 0;
                        padding-left: 0.75rem;
                        color: #64748b;
                        pointer-events: none;
                        transition: color 0.2s;
                    }

                    .input-wrapper:focus-within .input-icon {
                        color: #34d399;
                    }

                    .login-input {
                        width: 100%;
                        padding: 0.625rem 0.75rem;
                        padding-left: 2.5rem;
                        background-color: rgba(15, 23, 42, 0.5);
                        border: 1px solid #334155;
                        border-radius: 0.75rem;
                        color: #ffffff;
                        font-size: 0.875rem;
                        outline: none;
                        transition: all 0.2s;
                        box-sizing: border-box;
                    }

                    .login-input.has-right-icon {
                        padding-right: 2.5rem;
                    }

                    .login-input::placeholder {
                        color: #94a3b8;
                    }

                    .login-input:focus {
                        border-color: transparent;
                        box-shadow: 0 0 0 2px #10b981;
                    }

                    .toggle-password-btn {
                        position: absolute;
                        right: 0;
                        padding-right: 0.75rem;
                        background: none;
                        border: none;
                        color: #64748b;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        transition: color 0.2s;
                    }

                    .toggle-password-btn:hover {
                        color: #34d399;
                    }

                    .login-submit-btn {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        padding: 0.75rem 1rem;
                        margin-top: 0.5rem;
                        border: 1px solid transparent;
                        border-radius: 0.75rem;
                        background-color: #059669;
                        color: #ffffff;
                        font-size: 0.875rem;
                        font-weight: 700;
                        cursor: pointer;
                        box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);
                        transition: all 0.2s;
                    }

                    .login-submit-btn:hover:not(:disabled) {
                        background-color: #10b981;
                        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.23);
                    }

                    .login-submit-btn:disabled {
                        opacity: 0.7;
                        cursor: not-allowed;
                    }

                    .login-footer {
                        margin-top: 2rem;
                        text-align: center;
                        font-size: 0.875rem;
                        color: #94a3b8;
                    }

                    .login-link {
                        font-weight: 600;
                        color: #34d399;
                        text-decoration: none;
                    }

                    .login-link:hover {
                        color: #6ee7b7;
                    }
                `}
      </style>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <LogIn size={40} />
            </div>
            <h2 className="login-title">Admin Portal</h2>
            <p className="login-subtitle">
              Enter username to access your admin dashboard
            </p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label className="input-label">Username</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input has-right-icon"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
