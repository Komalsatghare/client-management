import React, { useState } from 'react';
import { X, Upload, Calendar, IndianRupee, ListChecks, FolderGit2 } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const css = `
@keyframes rpmSlide { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:none} }
@keyframes rpmFade  { from{opacity:0} to{opacity:1} }

.rpm-overlay {
    position:fixed; inset:0;
    background:rgba(5,10,24,0.85); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    z-index:1200; padding:20px;
    animation:rpmFade .2s ease;
}
.rpm-modal {
    background:#0d1832; border:1px solid rgba(255,255,255,0.1);
    border-radius:22px; width:100%; max-width:600px;
    max-height:90vh; overflow-y:auto;
    box-shadow:0 28px 70px rgba(0,0,0,0.75);
    animation:rpmSlide .25s ease-out;
    scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.07) transparent;
}
.rpm-hero {
    background:linear-gradient(135deg,#1a2d6b,#3b1f8c);
    padding:28px 28px 24px; border-bottom:1px solid rgba(255,255,255,0.07);
    position:relative; overflow:hidden;
}
.rpm-hero::before {
    content:''; position:absolute; top:-60px; right:-60px;
    width:200px; height:200px; border-radius:50%;
    background:radial-gradient(circle,rgba(139,92,246,0.25) 0%,transparent 70%);
}
.rpm-hero-close {
    position:absolute; top:18px; right:18px;
    background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.15);
    color:white; border-radius:9px; padding:6px 10px;
    cursor:pointer; font-size:16px; line-height:1;
    transition:all .2s; display:flex;
}
.rpm-hero-close:hover { background:rgba(255,255,255,0.22); }
.rpm-hero-icon {
    width:52px; height:52px; border-radius:15px;
    background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25);
    display:flex; align-items:center; justify-content:center;
    color:white; margin-bottom:14px;
}
.rpm-hero-title {
    margin:0 0 4px; font-size:20px; font-weight:800; color:white;
}
.rpm-hero-sub { margin:0; font-size:13px; color:rgba(255,255,255,0.6); }

.rpm-body { padding:26px 28px; }

.rpm-lbl {
    display:flex; align-items:center; gap:7px;
    font-size:11px; font-weight:700; color:#64748b;
    text-transform:uppercase; letter-spacing:.07em; margin-bottom:8px;
}
.rpm-inp, .rpm-textarea {
    width:100%; padding:11px 14px; box-sizing:border-box;
    border:1px solid rgba(255,255,255,0.09); border-radius:11px;
    font-size:13px; outline:none;
    background:rgba(255,255,255,0.04); color:#e2e8f0;
    font-family:'Inter',sans-serif; transition:all .2s; color-scheme:dark;
}
.rpm-inp::placeholder, .rpm-textarea::placeholder { color:#334155; }
.rpm-inp:focus, .rpm-textarea:focus {
    border-color:rgba(96,165,250,0.5);
    background:rgba(96,165,250,0.05);
    box-shadow:0 0 0 3px rgba(96,165,250,0.12);
}
.rpm-textarea { resize:vertical; line-height:1.65; }

.rpm-icon-field { position:relative; }
.rpm-icon-field .rpm-inp { padding-left:38px; }
.rpm-field-icon {
    position:absolute; left:12px; top:50%; transform:translateY(-50%);
    color:#475569; pointer-events:none;
}

.rpm-two-col { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(max-width:480px) { .rpm-two-col { grid-template-columns:1fr; } }

.rpm-group { margin-bottom:18px; }

.rpm-upload {
    border:1.5px dashed rgba(255,255,255,0.1); border-radius:12px;
    padding:24px; text-align:center; cursor:pointer;
    background:rgba(255,255,255,0.02); transition:all .2s;
}
.rpm-upload:hover { border-color:rgba(96,165,250,0.35); background:rgba(96,165,250,0.04); }
.rpm-upload-icon { color:#334155; margin:0 auto 10px; display:block; }
.rpm-upload-text { font-size:13px; font-weight:600; color:#475569; margin:0 0 3px; }
.rpm-upload-sub  { font-size:11px; color:#334155; margin:0; }

.rpm-error {
    padding:11px 14px; background:rgba(239,68,68,0.1); color:#f87171;
    border:1px solid rgba(239,68,68,0.25); border-radius:10px;
    font-size:13px; margin-bottom:16px;
}

.rpm-footer {
    display:flex; justify-content:flex-end; gap:10px;
    padding:20px 28px; border-top:1px solid rgba(255,255,255,0.07);
    background:rgba(0,0,0,0.15);
}
.rpm-btn-cancel {
    padding:10px 20px; background:rgba(255,255,255,0.05); color:#94a3b8;
    border:1px solid rgba(255,255,255,0.1); border-radius:11px;
    font-weight:600; font-size:13px; cursor:pointer;
    transition:all .2s; font-family:'Inter',sans-serif;
}
.rpm-btn-cancel:hover { background:rgba(255,255,255,0.09); color:#e2e8f0; }
.rpm-btn-submit {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 24px;
    background:linear-gradient(135deg,#3b82f6,#6366f1);
    color:white; border:none; border-radius:11px;
    font-weight:700; font-size:13px; cursor:pointer;
    box-shadow:0 4px 16px rgba(99,102,241,0.4);
    transition:all .2s; font-family:'Inter',sans-serif;
}
.rpm-btn-submit:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(99,102,241,0.5); }
.rpm-btn-submit:disabled { opacity:.6; cursor:not-allowed; transform:none; }
`;

export default function RequestProjectModal({ isOpen, onClose, onSuccess }) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        title: '', description: '', budget: '', deadline: '', requirements: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const token = localStorage.getItem('clientAuthToken');
            await axios.post('http://localhost:5000/api/project-requests', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
            onClose();
            setFormData({ title:'', description:'', budget:'', deadline:'', requirements:'' });
        } catch (err) {
            setError(err.response?.data?.message || t('fail_submit_request') || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{css}</style>
            <div className="rpm-overlay" onClick={onClose}>
                <div className="rpm-modal" onClick={e => e.stopPropagation()}>

                    {/* Hero Header */}
                    <div className="rpm-hero">
                        <button className="rpm-hero-close" onClick={onClose}><X size={16} /></button>
                        <div className="rpm-hero-icon"><FolderGit2 size={26} /></div>
                        <h2 className="rpm-hero-title">{t('request_new_project')}</h2>
                        <p className="rpm-hero-sub">{t('fill_details_sub')}</p>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit}>
                        <div className="rpm-body">
                            {error && <div className="rpm-error">{error}</div>}

                            <div className="rpm-group">
                                <label className="rpm-lbl">{t('project_title_label')}</label>
                                <input type="text" name="title" required className="rpm-inp"
                                    value={formData.title} onChange={handleChange}
                                    placeholder={t('project_title_placeholder') || "e.g. Skyline Luxury Apartments"} />
                            </div>

                            <div className="rpm-group">
                                <label className="rpm-lbl">{t('project_desc_label')}</label>
                                <textarea name="description" required rows={3} className="rpm-textarea"
                                    value={formData.description} onChange={handleChange}
                                    placeholder={t('project_desc_placeholder') || "Describe your project goals and overall vision…"} />
                            </div>

                            <div className="rpm-group">
                                <label className="rpm-lbl"><ListChecks size={13} /> {t('requirements_services')}</label>
                                <textarea name="requirements" rows={5} className="rpm-textarea" style={{ resize:"vertical" }}
                                    value={formData.requirements} onChange={handleChange}
                                    placeholder={t('requirements_placeholder') || "List specific requirements..."} />
                            </div>

                            <div className="rpm-two-col">
                                <div className="rpm-group">
                                    <label className="rpm-lbl">{t('estimated_budget')}</label>
                                    <div className="rpm-icon-field">
                                        <IndianRupee size={15} className="rpm-field-icon" />
                                        <input type="number" name="budget" required className="rpm-inp"
                                            value={formData.budget} onChange={handleChange}
                                            placeholder="5000000" />
                                    </div>
                                </div>
                                <div className="rpm-group">
                                    <label className="rpm-lbl"><Calendar size={13} /> {t('expected_deadline')}</label>
                                    <input type="date" name="deadline" required className="rpm-inp"
                                        value={formData.deadline} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="rpm-group">
                                <label className="rpm-lbl">{t('supporting_docs')}</label>
                                <div className="rpm-upload">
                                    <Upload size={28} className="rpm-upload-icon" />
                                    <p className="rpm-upload-text">{t('click_to_upload')}</p>
                                    <p className="rpm-upload-sub">{t('file_types')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="rpm-footer">
                            <button type="button" className="rpm-btn-cancel" onClick={onClose}>{t('cancel')}</button>
                            <button type="submit" className="rpm-btn-submit" disabled={loading}>
                                {loading ? t('submitting') : t('submit_request')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
