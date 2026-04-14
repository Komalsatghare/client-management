import { API_BASE_URL } from "../config";
import React, { useState } from 'react';
import axios from 'axios';
import './ClientDashboard.css';

export default function ChangePassword() {
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            return setMessage({ type: 'error', text: 'New password and confirm password do not match.' });
        }
        if (form.newPassword.length < 6) {
            return setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('clientAuthToken');
            await axios.post(
                '${API_BASE_URL}/api/client/change-password',
                { oldPassword: form.oldPassword, newPassword: form.newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to change password. Please try again.';
            setMessage({ type: 'error', text: errMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '480px' }}>
            {/* Card */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#f8fafc',
                }}>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '600', color: '#1e293b' }}>
                        Change Password
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                        Keep your account secure by updating your password.
                    </p>
                </div>

                {/* Body */}
                <div style={{ padding: '24px' }}>
                    {message && (
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            background: message.type === 'success' ? '#dcfce7' : '#fef2f2',
                            color: message.type === 'success' ? '#15803d' : '#b91c1c',
                            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                        }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Current Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="oldPassword"
                                placeholder="Enter current password"
                                value={form.oldPassword}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: '10px 12px',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        {/* New Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="Minimum 6 characters"
                                value={form.newPassword}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: '10px 12px',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-enter new password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                style={{
                                    padding: '10px 12px',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '4px',
                                padding: '11px',
                                background: loading ? '#93c5fd' : '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            {loading ? 'Updating...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}


