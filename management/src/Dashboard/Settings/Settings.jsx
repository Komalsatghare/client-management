import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../dashboard.css';

const Settings = () => {
    // ─── Change Password ─────────────────────────────────────────────
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // ─── Recovery Email ──────────────────────────────────────────────
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailMsg, setEmailMsg] = useState(null);

    const token = localStorage.getItem('authToken');
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch current email on mount
    useEffect(() => {
        const fetchAdminEmail = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/dashboard', authHeader);
                // Try to get email from a profile endpoint if available
            } catch {}
        };
        fetchAdminEmail();
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setMessage(null);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            return setMessage({ type: 'error', text: 'New password and confirm password do not match.' });
        }
        if (form.newPassword.length < 6) {
            return setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
        }
        setLoading(true);
        try {
            await axios.post(
                'http://localhost:5000/api/auth/change-password',
                { oldPassword: form.oldPassword, newPassword: form.newPassword },
                authHeader
            );
            setMessage({ type: 'success', text: '✅ Password changed successfully!' });
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail.trim())) {
            return setEmailMsg({ type: 'error', text: 'Please enter a valid email address.' });
        }
        setEmailLoading(true);
        setEmailMsg(null);
        try {
            const res = await axios.patch(
                'http://localhost:5000/api/admin/update-email',
                { email: recoveryEmail.trim() },
                authHeader
            );
            setCurrentEmail(res.data.email);
            setEmailMsg({ type: 'success', text: `✅ Recovery email set to ${res.data.email}` });
            setRecoveryEmail('');
        } catch (err) {
            setEmailMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update email.' });
        } finally {
            setEmailLoading(false);
        }
    };

    const sectionStyle = {
        background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0',
        padding: '24px 28px', marginBottom: 24, maxWidth: '520px'
    };
    const msgStyle = (type) => ({
        padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 500,
        background: type === 'success' ? '#f0fdf4' : '#fef2f2',
        color: type === 'success' ? '#15803d' : '#b91c1c',
        border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`,
    });

    return (
        <div className="table-container">
            <div className="table-header">
                <h3 className="table-title">Settings</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>

                {/* ── Recovery Email Section ───────────────────────────── */}
                <div style={sectionStyle}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                        🔐 Password Recovery Email
                    </h4>
                    <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 16px', lineHeight: 1.6 }}>
                        Set the email address where your OTP will be sent when you use "Forgot Password" on the login page.
                        {currentEmail && <> Currently set to: <strong style={{ color: '#2563eb' }}>{currentEmail}</strong></>}
                    </p>

                    {emailMsg && <div style={msgStyle(emailMsg.type)}>{emailMsg.text}</div>}

                    <form onSubmit={handleEmailSubmit}>
                        <div className="form-group">
                            <label className="form-label">Recovery Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="e.g. admin@yourdomain.com"
                                value={recoveryEmail}
                                onChange={e => { setRecoveryEmail(e.target.value); setEmailMsg(null); }}
                                required
                            />
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <button type="submit" className="btn-primary" disabled={emailLoading}>
                                {emailLoading ? 'Saving...' : 'Save Recovery Email'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Change Password Section ──────────────────────────── */}
                <div style={sectionStyle}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                        🔑 Change Password
                    </h4>
                    <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 16px' }}>
                        Update your admin account password below.
                    </p>

                    {message && <div style={msgStyle(message.type)}>{message.text}</div>}

                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input
                                type="password" name="oldPassword" className="form-input"
                                placeholder="Enter current password"
                                value={form.oldPassword} onChange={handleChange} required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password" name="newPassword" className="form-input"
                                placeholder="Minimum 6 characters"
                                value={form.newPassword} onChange={handleChange} required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password" name="confirmPassword" className="form-input"
                                placeholder="Re-enter new password"
                                value={form.confirmPassword} onChange={handleChange} required
                            />
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Updating...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Settings;
