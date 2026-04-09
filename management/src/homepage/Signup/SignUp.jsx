import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Eye, EyeOff, Lock, ShieldCheck, Phone, Mail } from "lucide-react";

export default function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role] = useState("admin"); // Fixed to admin
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/admin/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, phone, name, email }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("adminUsername", data.admin.username || "");
                localStorage.setItem("adminName", data.admin.name || "");
                localStorage.setItem("adminEmail", data.admin.email || "");
                localStorage.setItem("adminPhone", data.admin.phone || "");
                navigate("/admin-dashboard");
            } else {
                setError(data.message || "Registration failed. Please check your details.");
            }
        } catch (err) {
            console.error("Signup Error:", err);
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
                        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
                        font-family: 'Inter', 'Poppins', sans-serif;
                        padding: 1rem;
                    }

                    .signup-card {
                        max-width: 28rem;
                        width: 100%;
                        border-top: 4px solid #6366f1;
                        background-color: #1e293b;
                        border-radius: 1rem;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                        padding: 2.5rem;
                        transition: all 0.3s ease;
                    }

                    .signup-card:hover {
                        transform: scale(1.01);
                    }

                    .signup-header {
                        text-align: center;
                        margin-bottom: 2rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .signup-logo {
                        background-color: rgba(99, 102, 241, 0.1);
                        padding: 0.75rem;
                        border-radius: 50%;
                        margin-bottom: 1rem;
                        box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
                        border: 1px solid rgba(99, 102, 241, 0.3);
                        color: #818cf8;
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
                        color: #818cf8;
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

                    .signup-input::placeholder {
                        color: #94a3b8;
                    }

                    .signup-input:focus {
                        border-color: transparent;
                        box-shadow: 0 0 0 2px #6366f1;
                    }

                    .signup-select {
                        appearance: none;
                        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E");
                        background-repeat: no-repeat;
                        background-position: right 1rem top 50%;
                        background-size: 0.65rem auto;
                    }

                    .signup-select option {
                        background-color: #1e293b;
                        color: #ffffff;
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
                        color: #818cf8;
                    }

                    .signup-submit-btn {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        padding: 0.75rem 1rem;
                        margin-top: 0.5rem;
                        border: 1px solid transparent;
                        border-radius: 0.75rem;
                        background-color: #4f46e5;
                        color: #ffffff;
                        font-size: 0.875rem;
                        font-weight: 700;
                        cursor: pointer;
                        box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.39);
                        transition: all 0.2s;
                    }

                    .signup-submit-btn:hover:not(:disabled) {
                        background-color: #6366f1;
                        box-shadow: 0 6px 20px rgba(79, 70, 229, 0.23);
                    }

                    .signup-submit-btn:disabled {
                        opacity: 0.7;
                        cursor: not-allowed;
                    }

                    .signup-footer {
                        margin-top: 2rem;
                        text-align: center;
                        font-size: 0.875rem;
                        color: #94a3b8;
                    }

                    .signup-link {
                        font-weight: 600;
                        color: #818cf8;
                        text-decoration: none;
                    }

                    .signup-link:hover {
                        color: #a5b4fc;
                    }
                `}
            </style>
            <div className="signup-container">
                <div className="signup-card">
                    <div className="signup-header">
                        <div className="signup-logo">
                            <ShieldCheck size={40} />
                        </div>
                        <h2 className="signup-title">Admin Registration</h2>
                        <p className="signup-subtitle">
                            Create your admin account to manage clients and projects
                        </p>
                    </div>

                    {error && <div className="signup-error">{error}</div>}

                    <form onSubmit={handleSignup} className="signup-form">

                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    className="signup-input"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    className="signup-input"
                                    placeholder="e.g. Swapnil Dhanvij"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                    className="signup-input"
                                    placeholder="e.g. swapnil@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Phone Number</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    className="signup-input"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
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
                                    className="signup-input has-right-icon"
                                    placeholder="Create a strong password"
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

                        <div className="input-group">
                            <label className="input-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="signup-input has-right-icon"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="signup-submit-btn"
                            >
                                {loading ? "Creating Account..." : "Create Admin Account"}
                            </button>
                        </div>
                    </form>

                    <p className="signup-footer">
                        Already have an admin account?{" "}
                        <Link to="/login" className="signup-link">
                            Admin Login
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
