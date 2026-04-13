import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import '../dashboard.css';


const UserProfile = ({ onProfileUpdate }) => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        username: ''
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
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

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
                setStatus({ type: 'success', message: t('profile_updated_success') || "Profile updated!" });
                localStorage.setItem("adminName", res.data.user.name || "");
                localStorage.setItem("adminEmail", res.data.user.email || "");
                localStorage.setItem("adminUsername", res.data.user.username || "");
                
                if (onProfileUpdate) onProfileUpdate();
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setStatus({ type: 'error', message: err.response?.data?.message || t('profile_update_error') || "Error." });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>{t('loading') || "Loading..."}</div>;
    }

    const firstChar = formData.name ? formData.name.charAt(0).toUpperCase() : 'A';

    return (
        <div className="table-container">
            <div className="table-header">
                <h3 className="table-title">{t('my_profile') || "My Profile"}</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
                {status.message && (
                    <div style={{
                        padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem',
                        backgroundColor: status.type === 'success' ? '#def7ec' : '#fde8e8',
                        color: status.type === 'success' ? '#03543f' : '#9b1c1c'
                    }}>
                        {status.message}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '5rem', height: '5rem', borderRadius: '9999px', backgroundColor: '#334155',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.4rem', fontWeight: 'bold', marginRight: '1.5rem'
                    }}>
                        {firstChar}
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#f1f5f9' }}>
                            {formData.name || 'Admin User'}
                        </h4>
                        <p style={{ margin: 0, color: '#94a3b8' }}>{formData.email || 'admin@example.com'}</p>
                    </div>
                </div>

                <div style={{ maxWidth: '32rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">{t('full_name') || "Full Name"}</label>
                            <input 
                                type="text" 
                                name="name"
                                className="form-input" 
                                value={formData.name} 
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">{t('email_address') || "Email"}</label>
                            <input 
                                type="email" 
                                name="email"
                                className="form-input" 
                                value={formData.email} 
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">{t('username') || "Username"}</label>
                            <input 
                                type="text" 
                                name="username"
                                className="form-input" 
                                value={formData.username} 
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">{t('phone_number') || "Phone Number"}</label>
                            <input 
                                type="text" 
                                name="phone"
                                className="form-input" 
                                value={formData.phone} 
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            <button 
                                type="submit" 
                                className="btn-primary" 
                                disabled={updating}
                            >
                                {updating ? (t('updating') || "Updating...") : (t('update_profile_btn') || "Update Profile")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
