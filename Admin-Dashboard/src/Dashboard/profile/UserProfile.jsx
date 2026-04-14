import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { User, Mail, Phone, Shield, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from "../../config";
import '../dashboard.css';

const UserProfile = ({ onProfileUpdate }) => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.user) {
                    setFormData({
                        name: res.data.user.name || '',
                        username: res.data.user.username || '',
                        email: res.data.user.email || '',
                        phone: res.data.user.phone || ''
                    });
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setStatus({ type: 'error', message: t('profile_update_error') || "Failed to load profile." });
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [t]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setStatus({ type: '', message: '' });

        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.patch(`${API_BASE_URL}/api/auth/me`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                setStatus({ type: 'success', message: t('profile_updated_success') || "Profile updated successfully!" });
                // Update local storage too to keep things in sync immediately
                localStorage.setItem("adminName", res.data.user.name || "");
                localStorage.setItem("adminEmail", res.data.user.email || "");
                localStorage.setItem("adminUsername", res.data.user.username || "");
                localStorage.setItem("adminPhone", res.data.user.phone || "");
                
                // Trigger global refresh in DashboardLayout
                if (onProfileUpdate) onProfileUpdate();
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            const errorMsg = err.response?.data?.message || t('profile_update_error') || "Update failed.";
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
                <Loader2 className="animate-spin" style={{ color: '#3b82f6' }} size={32} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div className="page-header" style={{ marginBottom: '30px' }}>
                <div>
                   <h2 className="page-title">👤 {t('my_profile')}</h2>
                   <p className="page-subtitle">{t('profile_desc')}</p>
                </div>
            </div>

            {status.message && (
                <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`,
                    color: status.type === 'success' ? '#065f46' : '#991b1b',
                }}>
                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span style={{ fontWeight: 500 }}>{status.message}</span>
                </div>
            )}

            <div className="section-card" style={{ padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        {/* Personal Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', margin: 0 }}>
                                📋 {t('personal_information')}
                            </h3>
                            
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, color: '#64748b' }}>
                                    <User size={14} /> {t('full_name')}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, color: '#64748b' }}>
                                    <Phone size={14} /> {t('phone_number')}
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-input"
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Account Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', margin: 0 }}>
                                🔐 {t('account_details')}
                            </h3>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, color: '#64748b' }}>
                                    <Shield size={14} /> {t('username')}
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-input"
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, color: '#64748b' }}>
                                    <Mail size={14} /> {t('email_address')}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={updating}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                padding: '12px 28px',
                                background: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: updating ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {updating ? t('updating') : t('update_profile_btn')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
