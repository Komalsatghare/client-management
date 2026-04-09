import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Building2, UserPlus, Eye, EyeOff } from "lucide-react";

export default function ClientSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        project: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/client/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Securely store the real token under the client-specific key
                localStorage.setItem("clientAuthToken", data.token);
                localStorage.setItem("clientName", data.client.name);
                navigate("/client-dashboard");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            console.error("Client Signup Error:", err);
            setError("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>
                {`
                    .signup-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        font-family: 'Inter', 'Poppins', sans-serif;
                        padding: 1rem;
                    }

                    .signup-card {
                        max-width: 32rem;
                        width: 100%;
                        border-top: 4px solid #10b981;
                        background-color: #1e293b;
                        border-radius: 1rem;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                        padding: 2.5rem;
                        transition: all 0.3s ease;
                        border: 1px solid rgba(16, 185, 129, 0.2);
                    }

                    .signup-header {
                        text-align: center;
                        margin-bottom: 2rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .signup-logo {
                        background-color: rgba(16, 185, 129, 0.1);
                        padding: 0.75rem;
                        border-radius: 50%;
                        margin-bottom: 1rem;
                        box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
                        border: 1px solid rgba(16, 185, 129, 0.3);
                        color: #34d399;
                    }

                    .signup-title {
                        font-size: 1.875rem;
                        font-weight: 800;
                        color: #ffffff;
                        margin: 0;
                        letter-spacing: -0.025em;
                    }

                    .signup-subtitle {
                        font-size: 0.875rem;
                        color: #94a3b8;
                        margin-top: 0.5rem;
                        font-weight: 500;
                    }

                    .signup-error {
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

                    .signup-form {
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

                    .signup-input {
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

                    .signup-input.has-right-icon {
                        padding-right: 2.5rem;
                    }

                    .signup-input:focus {
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

                    .signup-submit-btn {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        padding: 0.75rem 1rem;
                        margin-top: 0.5rem;
                        border: 1px solid transparent;
                        border-radius: 0.75rem;
                        background-color: #10b981;
                        color: #ffffff;
                        font-size: 0.875rem;
                        font-weight: 700;
                        cursor: pointer;
                        box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);
                        transition: all 0.2s;
                    }

                    .signup-submit-btn:hover:not(:disabled) {
                        background-color: #059669;
                        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.23);
                    }

                    .signup-submit-btn:disabled {
                        opacity: 0.7;
                        cursor: not-allowed;
                    }

                    .login-link {
                        margin-top: 1.5rem;
                        text-align: center;
                        font-size: 0.875rem;
                        color: #94a3b8;
                    }

                    .login-link a {
                        color: #34d399;
                        text-decoration: none;
                        font-weight: 600;
                        margin-left: 0.25rem;
                    }

                    .login-link a:hover {
                        text-decoration: underline;
                    }
                `}
            </style>
            <div className="signup-container">
                <div className="signup-card">
                    <div className="signup-header">
                        <div className="signup-logo">
                            <UserPlus size={40} />
                        </div>
                        <h2 className="signup-title">Client Sign Up</h2>
                        <p className="signup-subtitle">
                            Create a portal account to track your distinct projects
                        </p>
                    </div>

                    {error && <div className="signup-error">{error}</div>}

                    <form onSubmit={handleSignup} className="signup-form">
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    className="signup-input"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    className="signup-input"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Project Name</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Building2 size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="project"
                                    className="signup-input"
                                    placeholder="Enter project/company name"
                                    value={formData.project}
                                    onChange={handleChange}
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
                                    name="password"
                                    className="signup-input has-right-icon"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                                className="signup-submit-btn"
                            >
                                {loading ? "Creating Account..." : "Create Client Account"}
                            </button>
                        </div>
                    </form>

                    <div className="login-link">
                        Already have a client account?
                        <Link to="/client-login">Sign In</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
