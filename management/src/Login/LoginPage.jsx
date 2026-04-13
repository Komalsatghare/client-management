import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Eye, EyeOff, Lock, LogIn } from "lucide-react";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { useLanguage } from "../context/LanguageContext";
import { API_BASE_URL } from "../config";

import LanguageSwitcher from "../components/LanguageSwitcher";

export default function LoginPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/universal-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Securely store the real token
        localStorage.setItem("authToken", data.token);
        if (data.role === 'admin') {
          navigate("/admin-dashboard");
        } else {
          navigate("/client-dashboard");
        }
      } else {
        // Invalid credentials or other errors
        setError(data.message || t('invalid_credentials') || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(t('server_error_login') || "Server error. Please try again later.");
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
        <div style={{ position: "absolute", top: "20px", right: "20px" }}>
          <LanguageSwitcher />
        </div>
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <LogIn size={40} />
            </div>
            <h2 className="login-title">{t('admin_portal_title') || "Admin Portal"}</h2>
            <p className="login-subtitle">
              {t('admin_login_subtitle') || "Enter your administrative credentials to manage the portal"}
            </p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin} className="login-form" noValidate>
            <div className="input-group">
              <label className="input-label">{t('email_username_label') || "Email or Username"}</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="identifier"
                  autoComplete="username"
                  inputMode="text"
                  className="login-input"
                  placeholder={t('enter_email_username_placeholder') || "Enter email or username"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">{t('password') || "Password"}</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input has-right-icon"
                  placeholder={t('enter_password_placeholder') || "Enter your password"}
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
              <div style={{ textAlign: "right", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  style={{ background: "none", border: "none", color: "#34d399", cursor: "pointer", fontSize: "13px", fontWeight: 600, padding: 0 }}
                >
                  {t('forgot_password') || "Forgot Password?"}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                {loading ? (t('signing_in') || "Signing In...") : (t('sign_in') || "Sign In")}
              </button>
            </div>
          </form>

          <p className="login-footer">
            {t('no_account_msg') || "Don't have an account?"}{" "}
            <Link to="/admin-signup" className="login-link">
              {t('sign_up') || "Sign Up"}
            </Link>
          </p>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgot}
        onClose={() => setShowForgot(false)}
        apiBase={`${API_BASE_URL}/api/auth`}
        accentColor="#10b981"
      />
    </>
  );
}
