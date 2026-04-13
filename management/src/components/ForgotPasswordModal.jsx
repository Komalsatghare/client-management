import React, { useState, useRef, useEffect } from "react";
import { Mail, ShieldCheck, Lock, Eye, EyeOff, X, ArrowLeft, RefreshCw } from "lucide-react";

/**
 * ForgotPasswordModal
 * Props:
 *   isOpen       {boolean}  - controls visibility
 *   onClose      {function} - called to close the modal
 *   apiBase      {string}   - e.g. "https://client-management-p4be.onrender.com/api/auth" or "https://client-management-p4be.onrender.com/api/client"
 *   accentColor  {string}   - e.g. "#10b981" (admin green) or "#3b82f6" (client blue)
 */
export default function ForgotPasswordModal({ isOpen, onClose, apiBase, accentColor = "#10b981" }) {
  // step: 1=email, 2=otp, 3=new-password, 4=success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  // Reset on open/close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1); setEmail(""); setOtp(["","","","","",""]);
        setResetToken(""); setNewPassword(""); setConfirmPassword("");
        setError(""); setCountdown(0);
      }, 300);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  if (!isOpen) return null;

  const accent = accentColor;
  const accentLight = accentColor + "22"; // 13% opacity

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/forgot-password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setStep(2);
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── OTP box key handler ───────────────────────────────────────────────────
  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { if (i < 6) next[i] = ch; });
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/forgot-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      setResetToken(data.resetToken);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = {
    width: "100%", padding: "11px 14px 11px 42px",
    background: "rgba(15,23,42,0.5)", border: "1px solid #334155",
    borderRadius: "10px", color: "#fff", fontSize: "14px",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  const stepLabels = ["Email", "Verify OTP", "New Password"];

  return (
    <>
      <style>{`
        .fp-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px; animation: fpFadeIn 0.2s ease;
        }
        @keyframes fpFadeIn { from { opacity:0 } to { opacity:1 } }
        .fp-card {
          background: #1e293b; border-radius: 16px; padding: 32px;
          width: 100%; max-width: 440px; position: relative;
          box-shadow: 0 25px 60px rgba(0,0,0,0.6);
          border: 1px solid #334155;
          animation: fpSlideUp 0.25s ease;
        }
        @keyframes fpSlideUp { from { transform: translateY(20px); opacity:0 } to { transform: translateY(0); opacity:1 } }
        .fp-close { position:absolute; top:16px; right:16px; background:none; border:none;
          color:#64748b; cursor:pointer; padding:4px; border-radius:6px; transition: color 0.2s, background 0.2s; }
        .fp-close:hover { color:#e2e8f0; background: #334155; }
        .fp-steps { display:flex; gap:6px; margin-bottom:24px; }
        .fp-step { flex:1; height:3px; border-radius:99px; background:#334155; transition: background 0.4s; }
        .fp-step.done { background: var(--fp-accent); }
        .fp-step.active { background: var(--fp-accent); opacity:0.6; }
        .fp-title { font-size:1.3rem; font-weight:800; color:#fff; margin:0 0 4px; }
        .fp-subtitle { font-size:13px; color:#94a3b8; margin: 0 0 20px; }
        .fp-error { background: rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.4);
          border-radius:8px; padding:10px 14px; color:#f87171; font-size:13px; margin-bottom:14px; }
        .fp-label { font-size:13px; font-weight:600; color:#cbd5e1; margin-bottom:6px; display:block; }
        .fp-input-wrap { position:relative; }
        .fp-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#64748b; pointer-events:none; }
        .fp-input { width:100%; padding:11px 14px 11px 42px; background:rgba(15,23,42,0.5);
          border:1px solid #334155; border-radius:10px; color:#fff; font-size:14px;
          outline:none; box-sizing:border-box; transition:border-color 0.2s; }
        .fp-input:focus { border-color: var(--fp-accent); box-shadow: 0 0 0 2px var(--fp-accent-light); }
        .fp-input::placeholder { color:#475569; }
        .fp-eye { position:absolute; right:13px; top:50%; transform:translateY(-50%);
          background:none; border:none; color:#64748b; cursor:pointer; padding:2px; }
        .fp-eye:hover { color:#94a3b8; }
        .fp-btn { width:100%; padding:12px; border:none; border-radius:10px; cursor:pointer;
          font-size:14px; font-weight:700; transition: all 0.2s; margin-top:16px;
          background: var(--fp-accent); color:#fff; box-shadow: 0 4px 14px var(--fp-accent-light); }
        .fp-btn:hover:not(:disabled) { filter: brightness(1.1); box-shadow: 0 6px 20px var(--fp-accent-light); }
        .fp-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .fp-back { background:none; border:none; color:#94a3b8; cursor:pointer; font-size:13px;
          display:flex; align-items:center; gap:4px; padding:0; margin-top:14px; transition: color 0.2s; }
        .fp-back:hover { color:#e2e8f0; }
        .fp-otp-row { display:flex; gap:10px; justify-content:center; margin:8px 0; }
        .fp-otp-box { width:48px; height:58px; background:rgba(15,23,42,0.6);
          border:2px solid #334155; border-radius:10px; text-align:center;
          font-size:24px; font-weight:900; color:#fff; outline:none;
          transition: border-color 0.2s, box-shadow 0.2s; caret-color:transparent; }
        .fp-otp-box:focus { border-color: var(--fp-accent); box-shadow: 0 0 0 2px var(--fp-accent-light); }
        .fp-otp-box.filled { border-color: var(--fp-accent); color: var(--fp-accent); }
        .fp-resend { font-size:13px; color:#64748b; text-align:center; margin-top:12px; }
        .fp-resend button { background:none; border:none; color: var(--fp-accent); cursor:pointer;
          font-size:13px; font-weight:600; padding:0; }
        .fp-resend button:disabled { opacity:0.5; cursor:not-allowed; }
        .fp-success { text-align:center; padding:8px 0; }
        .fp-success-icon { font-size:52px; margin-bottom:12px; display:block; }
        .fp-strength { height:4px; border-radius:99px; margin-top:8px; background:#334155; overflow:hidden; }
        .fp-strength-bar { height:100%; border-radius:99px; transition: width 0.3s, background 0.3s; }
      `}</style>

      <div className="fp-overlay" onClick={(e) => e.target === e.currentTarget && step !== 4 && onClose()}>
        <div className="fp-card" style={{ "--fp-accent": accent, "--fp-accent-light": accentLight }}>
          <button className="fp-close" onClick={onClose}><X size={18} /></button>

          {/* Progress Steps */}
          {step < 4 && (
            <div className="fp-steps">
              {stepLabels.map((_, i) => (
                <div key={i} className={`fp-step ${i + 1 < step ? "done" : i + 1 === step ? "active" : ""}`} />
              ))}
            </div>
          )}

          {/* ── STEP 1: Email ── */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: accentLight, padding: 10, borderRadius: 12, color: accent }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h2 className="fp-title">Forgot Password?</h2>
                  <p className="fp-subtitle" style={{ margin: 0 }}>Enter your email to receive a verification code</p>
                </div>
              </div>

              {error && <div className="fp-error">⚠️ {error}</div>}

              <form onSubmit={handleSendOtp}>
                <label className="fp-label">Email Address</label>
                <div className="fp-input-wrap">
                  <span className="fp-icon"><Mail size={16} /></span>
                  <input
                    className="fp-input" type="email" autoFocus
                    placeholder="Enter your registered email"
                    value={email} onChange={e => setEmail(e.target.value)} required
                  />
                </div>
                <button className="fp-btn" type="submit" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send Verification Code →"}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: accentLight, padding: 10, borderRadius: 12, color: accent }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h2 className="fp-title">Enter OTP</h2>
                  <p className="fp-subtitle" style={{ margin: 0 }}>Code sent to <strong style={{ color: "#e2e8f0" }}>{email}</strong></p>
                </div>
              </div>

              {error && <div className="fp-error">⚠️ {error}</div>}

              <form onSubmit={handleVerifyOtp}>
                <div className="fp-otp-row" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpRefs.current[idx] = el}
                      className={`fp-otp-box${digit ? " filled" : ""}`}
                      type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                    />
                  ))}
                </div>

                <div className="fp-resend">
                  {countdown > 0 ? (
                    <span>Resend OTP in <strong style={{ color: accent }}>{countdown}s</strong></span>
                  ) : (
                    <span>Didn't receive it? <button type="button" disabled={loading} onClick={handleSendOtp}>
                      <RefreshCw size={11} style={{ marginRight: 3 }} />Resend
                    </button></span>
                  )}
                </div>

                <button className="fp-btn" type="submit" disabled={loading || otp.join("").length < 6}>
                  {loading ? "Verifying..." : "Verify OTP →"}
                </button>
              </form>
              <button className="fp-back" onClick={() => { setStep(1); setOtp(["","","","","",""]); setError(""); }}>
                <ArrowLeft size={14} /> Back
              </button>
            </>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === 3 && (
            <>
              <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: accentLight, padding: 10, borderRadius: 12, color: accent }}>
                  <Lock size={22} />
                </div>
                <div>
                  <h2 className="fp-title">Set New Password</h2>
                  <p className="fp-subtitle" style={{ margin: 0 }}>Choose a strong password for your account</p>
                </div>
              </div>

              {error && <div className="fp-error">⚠️ {error}</div>}

              {/* Password strength indicator */}
              {newPassword && (() => {
                const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/]
                  .filter(r => r.test(newPassword)).length;
                const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
                const labels = ["Weak", "Fair", "Good", "Strong"];
                return (
                  <div style={{ marginBottom: 12 }}>
                    <div className="fp-strength">
                      <div className="fp-strength-bar" style={{ width: `${score * 25}%`, background: colors[score - 1] || "#ef4444" }} />
                    </div>
                    <p style={{ fontSize: 11, color: colors[score - 1] || "#ef4444", margin: "4px 0 0", textAlign: "right" }}>
                      {labels[score - 1] || "Weak"}
                    </p>
                  </div>
                );
              })()}

              <form onSubmit={handleResetPassword}>
                <label className="fp-label">New Password</label>
                <div className="fp-input-wrap" style={{ marginBottom: 14 }}>
                  <span className="fp-icon"><Lock size={16} /></span>
                  <input
                    className="fp-input" type={showNew ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                  />
                  <button type="button" className="fp-eye" onClick={() => setShowNew(!showNew)}>
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <label className="fp-label">Confirm Password</label>
                <div className="fp-input-wrap">
                  <span className="fp-icon"><Lock size={16} /></span>
                  <input
                    className="fp-input" type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                  />
                  <button type="button" className="fp-eye" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p style={{ fontSize: 12, color: "#f87171", margin: "4px 0 0" }}>Passwords do not match</p>
                )}

                <button className="fp-btn" type="submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password ✓"}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 4 && (
            <div className="fp-success">
              <span className="fp-success-icon">🎉</span>
              <h2 className="fp-title" style={{ marginBottom: 8 }}>Password Reset!</h2>
              <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>
                Your password has been updated successfully. You can now log in with your new password.
              </p>
              <button
                className="fp-btn"
                style={{ marginTop: 0 }}
                onClick={onClose}
              >
                Go to Login →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
