import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

import { FileText, UploadCloud, Download, Trash2, Shield, User, PenTool, CheckCircle, Eye, X, Save, Edit3, AlertCircle, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Palette, RotateCcw, Monitor } from 'lucide-react';
import mammoth from 'mammoth';
import { useLanguage } from '../context/LanguageContext';
import TransliteratedInput from './TransliteratedInput';

export default function UploadAgreement({ uploadedByRole, uploadedByName }) {
    const { t } = useLanguage();
    const [agreements, setAgreements] = useState([]);
    
    // Manual upload state
    const [projectName, setProjectName] = useState('');
    const [agreementFile, setAgreementFile] = useState(null);
    
    // Digital contract state
    const [digitalProjectName, setDigitalProjectName] = useState('');
    const [digitalContent, setDigitalContent] = useState('');
    const [digitalClientName, setDigitalClientName] = useState('');
    const [digitalClientDetails, setDigitalClientDetails] = useState('');
    const [digitalContractorName, setDigitalContractorName] = useState('');
    const [digitalAgreementNo, setDigitalAgreementNo] = useState('');
    const [digitalContactNo, setDigitalContactNo] = useState('');
    const [digitalLocation, setDigitalLocation] = useState('');
    const [digitalTotalCost, setDigitalTotalCost] = useState('');
    const [digitalArea, setDigitalArea] = useState('');
    const [digitalMeetingPlace, setDigitalMeetingPlace] = useState('');
    const [digitalClientAddress, setDigitalClientAddress] = useState('');
    const [digitalPlotDetails, setDigitalPlotDetails] = useState('');

    const [activeTab, setActiveTab] = useState('digital'); // 'manual' or 'digital'
    const [viewContext, setViewContext] = useState('workspace'); // 'workspace' or 'my_agreements'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');

    // Modal/Editor State
    const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' or 'finalized'
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [wordPreviewLoading, setWordPreviewLoading] = useState(false);
    const [wordPreviewHtml, setWordPreviewHtml] = useState('');
    const [editorLanguage, setEditorLanguage] = useState(() => localStorage.getItem('dhanvij_editor_lang') || 'en');
    const editorRef = React.useRef(null);

    // Custom Editor Toolbar Actions
    const execCmd = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
        const editor = document.getElementById('dhanvij-word-editor');
        if (editor) setEditedContent(editor.innerHTML);
    };

    const getToken = () => {
        const token = localStorage.getItem('authToken') || localStorage.getItem('clientAuthToken');
        if (!token || token === 'null' || token === 'undefined') return null;
        return token;
    };

    useEffect(() => {
        fetchAgreements();
        if (uploadedByRole === 'admin') {
            fetchClients();
        }
    }, []);

    const fetchClients = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/clients`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setClients(res.data);
        } catch (err) {
            console.error('Error fetching clients', err);
        }
    };

    const fetchAgreements = async () => {
        const token = getToken();
        if (!token) {
            console.warn('No authentication token found. Redirecting or skipping fetch.');
            return;
        }
        try {
            const res = await axios.get(`${API_BASE_URL}/api/agreements`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAgreements(res.data);
        } catch (err) {
            console.error('Error fetching agreements', err);
            if (err.response?.status === 401) {
                setError('Session expired. Please log in again.');
            }
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!projectName || !agreementFile) {
            setError(t('error_missing_project_file') || 'Please provide a project name and select a file.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('projectName', projectName);
        formData.append('agreementFile', agreementFile);
        formData.append('uploadedByRole', uploadedByRole);
        formData.append('uploadedByName', uploadedByName || 'Unknown');
        if (selectedClientId) formData.append('clientId', selectedClientId);

        try {
            await axios.post(`${API_BASE_URL}/api/agreements/upload`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${getToken()}`
                }
            });
            setSuccess(t('agreement_upload_success') || 'Agreement uploaded successfully!');
            setProjectName('');
            setAgreementFile(null);
            fetchAgreements();
        } catch (err) {
            console.error('Upload Error', err);
            setError(t('fail_upload_agreement') || 'Failed to upload agreement.');
        } finally {
            setLoading(false);
        }
    };

    const toggleEditorLang = (newLang) => {
        setEditorLanguage(newLang);
        localStorage.setItem('dhanvij_editor_lang', newLang);
    };

    const transliterateWord = async (text) => {
        try {
            const res = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=mr-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`);
            const data = await res.json();
            if (data && data[0] === 'SUCCESS') {
                return data[1][0][1][0];
            }
        } catch (err) {
            console.error("Transliteration error:", err);
        }
        return text;
    };

    const handleEditorKeyDown = async (e) => {
        if (editorLanguage !== 'mr') return;

        // Detect space or enter
        if (e.key === ' ' || e.key === 'Enter') {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const textNode = range.startContainer;
            
            // We only handle text nodes for simple transliteration
            if (textNode.nodeType !== Node.TEXT_NODE) return;

            const content = textNode.textContent;
            const cursorTitle = range.startOffset;
            
            // Find the last word typed before the cursor
            const textBeforeCursor = content.substring(0, cursorTitle);
            const words = textBeforeCursor.split(/\s/);
            const lastWord = words[words.length - 1];

            if (lastWord && /[a-zA-Z]+$/.test(lastWord)) {
                // Find start of the actual alphabet-only part to transliterate
                const match = lastWord.match(/[a-zA-Z]+$/);
                const actualWord = match[0];
                
                const marathiWord = await transliterateWord(actualWord);
                if (marathiWord && marathiWord !== actualWord) {
                    const startPos = cursorTitle - actualWord.length;
                    const newContent = content.substring(0, startPos) + marathiWord + content.substring(cursorTitle);
                    textNode.textContent = newContent;
                    
                    const newRange = document.createRange();
                    newRange.setStart(textNode, startPos + marathiWord.length);
                    newRange.setEnd(textNode, startPos + marathiWord.length);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            }
        }
    };
    const handleDigitalSubmit = async (e) => {
        e.preventDefault();
        if (!digitalProjectName) {
            setError(t('error_missing_project') || 'Please provide a project name.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post(`${API_BASE_URL}/api/agreements/digital`, {
                projectName: digitalProjectName,
                uploadedByRole,
                uploadedByName: digitalClientName || uploadedByName || 'Unknown',
                contractorName: digitalContractorName,
                clientAddress: digitalClientDetails,
                agreementNumber: digitalAgreementNo,
                contactNumber: digitalContactNo,
                location: digitalLocation,
                totalCost: digitalTotalCost,
                area: digitalArea,
                meetingPlace: digitalMeetingPlace,
                plotDetails: digitalPlotDetails,
                clientId: selectedClientId
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setSuccess(t('digital_contract_init_success') || 'Digital contract initiated successfully!');
            // Reset fields
            setDigitalProjectName('');
            setDigitalClientName('');
            setDigitalClientDetails('');
            setDigitalContractorName('');
            setDigitalAgreementNo('');
            setDigitalContactNo('');
            setDigitalLocation('');
            setDigitalTotalCost('');
            setDigitalArea('');
            setDigitalMeetingPlace('');
            setDigitalClientAddress('');
            setDigitalPlotDetails('');
            fetchAgreements();
        } catch (err) {
            console.error('Digital Contract Error', err);
            setError(t('fail_init_digital_contract') || 'Failed to initiate digital contract.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedContract) return;
        setLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/api/agreements/${selectedContract._id}`, {
                content: editedContent,
                lastEditedBy: uploadedByName
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            alert("Agreement updated successfully! Existing signatures have been cleared as a legal precaution.");
            setIsEditing(false);
            fetchAgreements();
            // Refresh local state
            setSelectedContract(prev => ({ ...prev, content: editedContent, adminSigned: false, clientSigned: false, status: 'Unsigned' }));
        } catch (err) {
            console.error('Update Error', err);
            alert("Failed to update agreement.");
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await axios.put(`${API_BASE_URL}/api/agreements/${id}/sign`, {
                role: uploadedByRole // 'admin' or 'client'
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            alert("Signed successfully!");
            if (editModalOpen) setEditModalOpen(false);
            fetchAgreements();
        } catch (err) {
            console.error('Sign Error', err);
            alert("Failed to sign agreement.");
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this agreement?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/agreements/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            fetchAgreements();
        } catch (err) {
            console.error('Delete Error', err);
            alert("Failed to delete agreement.");
        }
    };

    const openEditModal = async (contract) => {
        setSelectedContract(contract);
        setEditedContent(contract.content || '');
        setWordPreviewHtml('');
        setIsEditing(false);
        setEditModalOpen(true);

        // Word Preview Logic
        const mime = contract.mimetype || '';
        const isWord = mime.includes('word') || mime.includes('officedocument') || contract.originalName?.endsWith('.docx') || contract.originalName?.endsWith('.doc');

        if (contract.type === 'manual' && isWord && contract.fileUrl) {
            setWordPreviewLoading(true);
            try {
                const fileUrl = `${API_BASE_URL}${contract.fileUrl}`;
                const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
                const result = await mammoth.convertToHtml({ arrayBuffer: response.data });
                setWordPreviewHtml(result.value);
            } catch (err) {
                console.error("Word Conversion Error:", err);
                if (err.response?.status === 404) {
                    setWordPreviewHtml(`
                        <div style="padding: 40px; text-align: center; color: #94a3b8;">
                            <div style="font-size: 40px; margin-bottom: 20px;">📂</div>
                            <h3 style="color: #f8fafc; margin-bottom: 10px;">File Not Found on Server</h3>
                            <p style="font-size: 14px; max-width: 400px; margin: 0 auto 20px;">
                                This file was likely deleted during a server restart. On Render's free tier, uploaded files are temporary.
                            </p>
                            <p style="font-size: 13px; font-weight: 600; color: #818cf8;">
                                Please delete this record and upload the document again.
                            </p>
                        </div>
                    `);
                } else {
                    setWordPreviewHtml('<p style="color: #ef4444; padding: 20px; text-align: center;">Failed to render Word document preview. Please use the download option below.</p>');
                }
            } finally {
                setWordPreviewLoading(false);
            }
        }
    };



    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#e2e8f0', marginTop: '24px' }}>
            <style>{`
                .ua-card { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 24px; backdrop-filter: blur(10px); }
                .ua-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px; }
                .ua-tab { background: transparent; border: none; color: #94a3b8; font-size: 14px; font-weight: 600; cursor: pointer; padding: 6px 12px; border-radius: 6px; transition: all .2s; }
                .ua-tab.active { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
                .ua-form { display: flex; flex-direction: column; gap: 16px; background: rgba(255, 255, 255, 0.03); padding: 20px; border-radius: 12px; border: 1px dashed rgba(255, 255, 255, 0.15); margin-bottom: 24px; }
                .ua-input-grp { display: flex; flex-direction: column; gap: 8px; width: 100%; }
                .ua-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .06em; }
                .ua-input { padding: 10px 14px; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 13px; outline: none; transition: border-color .2s; }
                .ua-input:focus { border-color: rgba(96, 165, 250, 0.5); }
                .ua-btn { padding: 10px 20px; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .2s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); align-self: flex-start; }
                .ua-btn:hover:not(:disabled) { box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4); transform: translateY(-1px); }
                .ua-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .ua-item { display: flex; align-items: center; justify-content: space-between; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.06); padding: 14px 20px; border-radius: 10px; transition: background .2s; }
                .ua-item:hover { background: rgba(255, 255, 255, 0.06); }
                .ua-status { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
                
                .ua-modal-overlay { position: fixed; inset: 0; background: rgba(5, 10, 24, 0.85); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
                .ua-modal { background: #0f172a; width: 100%; max-width: 900px; height: 100vh; max-height: 100vh; overflow-y: hidden; padding: 20px 40px; position: relative; display: flex; flex-direction: column; border-radius: 0; box-shadow: 0 0 100px rgba(0,0,0,0.9); }
                
                @media (max-width: 768px) {
                    .ua-modal { padding: 20px 15px; }
                    .ua-item { flex-direction: column; align-items: flex-start; gap: 15px; }
                    .ua-item > div:last-child { width: 100%; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); pt: 10px; }
                    .ua-card { padding: 15px !important; }
                    .ua-tabs { flex-direction: column; }
                    .ua-tabs .ua-tab { width: 100%; border-radius: 8px !important; text-align: left; }
                }
                .ua-modal-close { position: absolute; top: 24px; right: 24px; background: rgba(255, 255, 255, 0.08); border: none; padding: 12px; border-radius: 50%; color: #f8fafc; cursor: pointer; transition: all 0.2s; z-index: 100; display: flex; align-items: center; justify-content: center; }
                .ua-modal-close:hover { background: #ef4444; color: white; transform: rotate(90deg); }

                .ql-editor { min-height: 400px; font-family: 'Inter', sans-serif; color: #e2e8f0; font-size: 14px; background: rgba(255, 255, 255, 0.02); }
                .ql-toolbar { background: #1e293b; border-color: rgba(255, 255, 255, 0.1) !important; border-radius: 8px 8px 0 0; }
                .ql-container { border-color: rgba(255, 255, 255, 0.1) !important; border-radius: 0 0 8px 8px; }
                .ql-snow .ql-stroke { stroke: #94a3b8 !important; }
                .ql-snow .ql-fill { fill: #94a3b8 !important; }
                .ql-snow .ql-picker { color: #94a3b8 !important; }
                
                .agreement-preview { background: white; color: #1e293b; padding: 60px; border-radius: 4px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); line-height: 1.6; font-family: 'Inter', 'Noto Sans Marathi', sans-serif; overflow-x: auto; width: 100%; box-sizing: border-box; }
                .agreement-preview h1, .agreement-preview h2, .agreement-preview h3 { color: #0f172a; margin: 0 0 20px 0; }
                .agreement-preview p { margin-bottom: 1.2em; }
                .agreement-preview table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 13px; border: 1px solid #cbd5e1; }
                .agreement-preview th, .agreement-preview td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; vertical-align: top; }
                .agreement-preview th { background: #f8fafc; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px; }
                
                .agreement-preview .section-header { 
                    background: #2563eb !important; 
                    color: white !important; 
                    padding: 12px 18px !important; 
                    font-weight: 900 !important; 
                    margin: 40px 0 20px !important; 
                    border-radius: 4px !important;
                    font-size: 14px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 1px !important;
                }

                /* Dhanvij Word Editor - Content Styling */
                .dw-editor { 
                    font-family: 'Inter', 'Noto Sans Marathi', sans-serif; 
                    line-height: 1.8; 
                    padding: 50px;
                    min-height: 700px;
                    background: white;
                    color: #1e293b;
                    outline: none;
                }
                .dw-editor .section-header { 
                    background: #2563eb; color: white; padding: 12px 20px; 
                    font-weight: 900; margin: 30px 0 20px; border-radius: 4px;
                    text-transform: uppercase;
                }
                .dw-editor table { width: 100%; border-collapse: collapse; border: 2px solid #1e293b; margin-bottom: 25px; }
                .dw-editor th, .dw-editor td { border: 1px solid #cbd5e1; padding: 14px; }
                .dw-editor th { background: #f8fafc; font-weight: 700; }
                
                .dw-toolbar {
                    position: sticky; top: 0; z-index: 100;
                    background: #0f172a; border-bottom: 2px solid #1e293b;
                    padding: 12px 20px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
                }
                .dw-tool-btn {
                    background: transparent; border: 1px solid rgba(255,255,255,0.1); 
                    color: #94a3b8; padding: 6px; border-radius: 6px; cursor: pointer; transition: all 0.2s;
                    display: flex; align-items: center; justify-content: center;
                }
                .dw-tool-btn:hover { background: rgba(255,255,255,0.06); color: white; border-color: rgba(255,255,255,0.2); }
                .dw-tool-btn.active { background: #2563eb; color: white; border-color: #3b82f6; }
                
                .dw-select {
                    background: #1e293b; border: 1px solid rgba(255,255,255,0.1);
                    color: white; padding: 4px 8px; border-radius: 6px; font-size: 12px; outline: none; cursor: pointer;
                }

                .agreement-preview .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    border: 1px solid #cbd5e1;
                    margin-bottom: 20px;
                }
                .agreement-preview .details-label { padding: 8px 12px; background: #f8fafc; border-bottom: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; font-weight: 700; }
                .agreement-preview .details-value { padding: 8px 12px; border-bottom: 1px solid #cbd5e1; }
                
                .agreement-preview .price-quote {
                    background: #fff1f2;
                    border: 2px dashed #e11d48;
                    padding: 15px;
                    text-align: center;
                    font-size: 18px;
                    font-weight: 900;
                    color: #be123c;
                    margin: 30px 0;
                    border-radius: 8px;
                }
            `}</style>

            <div className="ua-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                    <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: '#818cf8' }}>
                        <Shield size={20} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                            {t('contracts_agreements')}
                        </h2>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                            {viewContext === 'workspace' ? 'Draft, negotiate and manage active agreements.' : 'Your secure vault of finalized and signed records.'}
                        </p>
                    </div>
                </div>

                {/* PRIMARY NAVIGATION */}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                    <button 
                        onClick={() => setViewContext('workspace')}
                        style={{ background: 'transparent', border: 'none', color: viewContext === 'workspace' ? '#818cf8' : '#64748b', fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: '0 4px 10px', position: 'relative', transition: 'all 0.2s' }}
                    >
                        Agreement Workspace
                        {viewContext === 'workspace' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: '#818cf8', borderRadius: '2px' }} />}
                    </button>
                    <button 
                        onClick={() => setViewContext('my_agreements')}
                        style={{ background: 'transparent', border: 'none', color: viewContext === 'my_agreements' ? '#10b981' : '#64748b', fontSize: '14px', fontWeight: 700, cursor: 'pointer', padding: '0 4px 10px', position: 'relative', transition: 'all 0.2s' }}
                    >
                        My Agreements
                        {viewContext === 'my_agreements' && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: '#10b981', borderRadius: '2px' }} />}
                    </button>
                </div>

                {error && <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
                {success && <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{success}</div>}

                {viewContext === 'workspace' ? (
                    <>
                        <div className="ua-tabs">
                            <button className={`ua-tab ${activeTab === 'digital' ? 'active' : ''}`} onClick={() => setActiveTab('digital')}>
                                <PenTool size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> {t('create_shared_agreement')}
                            </button>
                            <button className={`ua-tab ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => setActiveTab('manual')}>
                                <UploadCloud size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} /> {t('upload_final_pdf')}
                            </button>
                        </div>

                        {activeTab === 'digital' ? (
                            <form className="ua-form" onSubmit={handleDigitalSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%', marginBottom: '20px' }}>
                                    <TransliteratedInput 
                                        label={t('project_title_label')}
                                        placeholder={t('project_title_placeholder')}
                                        value={digitalProjectName}
                                        onChange={(val) => setDigitalProjectName(val)}
                                        required
                                    />
                                    <TransliteratedInput 
                                        label={t('client_party1_name')}
                                        placeholder={t('client_name_placeholder')}
                                        value={digitalClientName}
                                        onChange={(val) => setDigitalClientName(val)}
                                        required
                                    />
                                    <TransliteratedInput 
                                        label={t('contractor_name_label')}
                                        placeholder={t('contractor_name_placeholder')}
                                        value={digitalContractorName}
                                        onChange={(val) => setDigitalContractorName(val)}
                                        required
                                    />

                                    {uploadedByRole === 'admin' && (
                                        <div className="ua-input-grp">
                                            <label className="ua-label">Assign to Client (Account) *</label>
                                            <select 
                                                className="ua-input" 
                                                value={selectedClientId} 
                                                onChange={(e) => setSelectedClientId(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Select Client Account --</option>
                                                {clients.map(c => (
                                                    <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <TransliteratedInput 
                                        label={t('agreement_number')}
                                        placeholder={t('agreement_no_placeholder')}
                                        value={digitalAgreementNo}
                                        onChange={(val) => setDigitalAgreementNo(val)}
                                    />
                                    <TransliteratedInput 
                                        label={t('phone')}
                                        placeholder={t('phone_placeholder')}
                                        value={digitalContactNo}
                                        onChange={(val) => setDigitalContactNo(val)}
                                    />
                                    <TransliteratedInput 
                                        label={t('site_location')}
                                        placeholder={t('location_placeholder')}
                                        value={digitalLocation}
                                        onChange={(val) => setDigitalLocation(val)}
                                    />
                                    <TransliteratedInput 
                                        label={t('total_cost')}
                                        placeholder={t('total_cost_placeholder')}
                                        value={digitalTotalCost}
                                        onChange={(val) => setDigitalTotalCost(val)}
                                    />
                                    <TransliteratedInput 
                                        label={t('total_area')}
                                        placeholder={t('total_area_placeholder')}
                                        value={digitalArea}
                                        onChange={(val) => setDigitalArea(val)}
                                    />
                                    <TransliteratedInput 
                                        label={t('meeting_place')}
                                        placeholder={t('meeting_place_placeholder')}
                                        value={digitalMeetingPlace}
                                        onChange={(val) => setDigitalMeetingPlace(val)}
                                    />
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <TransliteratedInput 
                                            label={t('client_bio')}
                                            isTextArea={true}
                                            rows={2}
                                            placeholder={t('client_details_placeholder')}
                                            value={digitalClientDetails}
                                            onChange={(val) => setDigitalClientDetails(val)}
                                        />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <TransliteratedInput 
                                            label={t('plot_details')}
                                            isTextArea={true}
                                            rows={2}
                                            placeholder={t('plot_details_placeholder')}
                                            value={digitalPlotDetails}
                                            onChange={(val) => setDigitalPlotDetails(val)}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" className="ua-btn" disabled={loading} style={{ padding: '12px 30px' }}>
                                        <Save size={18} />
                                        {loading ? t('submitting') : t('initiate_draft_btn')}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form className="ua-form" onSubmit={handleFileUpload}>
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%', alignItems: 'flex-end' }}>
                                    <div className="ua-input-grp" style={{ flex: 1 }}>
                                        <label className="ua-label">{t('project_title_label')}</label>
                                        <input 
                                            type="text" 
                                            className="ua-input" 
                                            placeholder={t('project_title_placeholder')}
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                        />
                                    </div>
                                    <div className="ua-input-grp" style={{ flex: 1 }}>
                                        <label className="ua-label">{t('supporting_docs')}</label>
                                        <input 
                                            type="file" 
                                            style={{ fontSize: '13px', color: '#94a3b8', padding: '9px 0' }} 
                                            onChange={(e) => setAgreementFile(e.target.files[0])}
                                        />
                                    </div>

                                    {uploadedByRole === 'admin' && (
                                        <div className="ua-input-grp" style={{ flex: 1 }}>
                                            <label className="ua-label">Assign to Client *</label>
                                            <select 
                                                className="ua-input" 
                                                value={selectedClientId} 
                                                onChange={(e) => setSelectedClientId(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Select Client --</option>
                                                {clients.map(c => (
                                                    <option key={c._id} value={c._id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <button type="submit" className="ua-btn" disabled={loading}>
                                        <UploadCloud size={16} />
                                        {loading ? t('submitting') : t('upload_btn')}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 15px' }}>
                                <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 800, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Monitor size={15} style={{ color: '#818cf8' }} /> Active Negotiations
                                </h3>
                            </div>
                            {(() => {
                                const activeDigital = agreements.filter(agr => agr.type === 'digital' && agr.status !== 'Active');
                                if (activeDigital.length === 0) return <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No active digital negotiations found.</div>;
                                return (
                                    <div className="ua-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {activeDigital.map(agr => (
                                            <div key={agr._id} className="ua-item">
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '14.5px', color: '#e2e8f0' }}>{agr.projectName}</p>
                                                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#64748b' }}>
                                                        <span>ADMIN: {agr.adminSigned ? 'SIGNED' : 'PENDING'}</span>
                                                        <span>•</span>
                                                        <span>CLIENT: {agr.clientSigned ? 'SIGNED' : 'PENDING'}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => openEditModal(agr)} style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Eye size={14} /> Open Workspace
                                                    </button>
                                                    <button onClick={(e) => handleDelete(agr._id, e)} style={{ padding: '6px 10px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </>
                ) : (
                    <div>
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ margin: '0 0 15px', fontSize: '14.5px', fontWeight: 800, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle size={15} style={{ color: '#10b981' }} /> Finalized Records
                            </h3>
                            {(() => {
                                const finalized = agreements.filter(agr => agr.status === 'Active' || agr.type === 'manual');
                                if (finalized.length === 0) return <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center', color: '#64748b' }}>No finalized agreements found in your vault.</div>;
                                return (
                                    <div className="ua-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {finalized.map(agr => (
                                            <div key={agr._id} className="ua-item">
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <button 
                                                        onClick={() => openEditModal(agr)} 
                                                        style={{ margin: 0, fontWeight: 700, fontSize: '14.5px', color: '#60a5fa', textDecoration: 'none', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                                                    >
                                                        {agr.projectName}
                                                    </button>
                                                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#64748b' }}>
                                                        <span>TYPE: {agr.type.toUpperCase()}</span>
                                                        <span>•</span>
                                                        <span>STATUS: {agr.status.toUpperCase()}</span>
                                                        <span>•</span>
                                                        <span>BY: {agr.uploadedByName || agr.uploadedByRole.toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => openEditModal(agr)} style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={14} /> View</button>
                                                    {agr.fileUrl && (
                                                        <a href={`${API_BASE_URL}${agr.fileUrl}`} target="_blank" rel="noreferrer" download style={{ textDecoration: 'none' }}>
                                                            <button style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.05)', color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={14} /> Download</button>
                                                        </a>
                                                    )}
                                                    {uploadedByRole === 'admin' && <button onClick={(e) => handleDelete(agr._id, e)} style={{ padding: '6px 10px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* EDIT/VIEW MODAL */}
            {editModalOpen && selectedContract && (
                <div className="ua-modal-overlay" onClick={() => setEditModalOpen(false)}>
                    <div className="ua-modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <button className="ua-modal-close" onClick={() => setEditModalOpen(false)}><X size={16} /></button>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '15px', paddingRight: '60px' }}>
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
                                {selectedContract.status === 'Active' ? 'Final Agreement Record' : 'Shared Agreement Workspace'}
                            </h2>
                            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                Project: <strong style={{ color: '#f1f5f9' }}>{selectedContract.projectName}</strong>
                            </p>
                        </div>

                        {isEditing ? (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '600px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', background: '#0f172a' }}>
                                    {/* EXCLUSIVE DHANVIJ WORD TOOLBAR */}
                                    <div className="dw-toolbar">
                                        <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '12px' }}>
                                            <button onClick={() => execCmd('bold')} className="dw-tool-btn" title="Bold"><Bold size={16} /></button>
                                            <button onClick={() => execCmd('italic')} className="dw-tool-btn" title="Italic"><Italic size={16} /></button>
                                            <button onClick={() => execCmd('underline')} className="dw-tool-btn" title="Underline"><Underline size={16} /></button>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '12px' }}>
                                            <Type size={16} style={{ color: '#64748b' }} />
                                            <select className="dw-select" onChange={(e) => execCmd('formatBlock', e.target.value)}>
                                                <option value="p">Normal Text</option>
                                                <option value="h1">Main Title</option>
                                                <option value="h2">Section Header</option>
                                                <option value="h3">Sub-header</option>
                                            </select>
                                            <select className="dw-select" onChange={(e) => execCmd('fontSize', e.target.value)}>
                                                <option value="3">Size: Default</option>
                                                <option value="1">Small</option>
                                                <option value="4">Large</option>
                                                <option value="5">Huge</option>
                                            </select>
                                        </div>

                                        <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '12px' }}>
                                            <button onClick={() => execCmd('justifyLeft')} className="dw-tool-btn"><AlignLeft size={16} /></button>
                                            <button onClick={() => execCmd('justifyCenter')} className="dw-tool-btn"><AlignCenter size={16} /></button>
                                            <button onClick={() => execCmd('justifyRight')} className="dw-tool-btn"><AlignRight size={16} /></button>
                                            <button onClick={() => execCmd('justifyFull')} className="dw-tool-btn"><AlignJustify size={16} /></button>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <Palette size={16} style={{ color: '#64748b' }} />
                                            <input type="color" className="dw-select" style={{ padding: '0', width: '24px', height: '24px' }} onChange={(e) => execCmd('foreColor', e.target.value)} title="Text Color" />
                                            <button onClick={() => execCmd('removeFormat')} className="dw-tool-btn" title="Clear Formatting"><RotateCcw size={16} /></button>
                                        </div>

                                        {/* EDITOR LANGUAGE TOGGLE */}
                                        <div style={{ marginLeft: 'auto', display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <button 
                                                type="button" 
                                                onClick={() => toggleEditorLang('en')}
                                                style={{ 
                                                    padding: '2px 10px', fontSize: '10px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                                                    background: editorLanguage === 'en' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                                                    color: editorLanguage === 'en' ? 'white' : '#64748b', fontWeight: 800
                                                }}
                                            >
                                                EN
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => toggleEditorLang('mr')}
                                                style={{ 
                                                    padding: '2px 10px', fontSize: '10px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                                                    background: editorLanguage === 'mr' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                                                    color: editorLanguage === 'mr' ? 'white' : '#64748b', fontWeight: 800
                                                }}
                                            >
                                                MR
                                            </button>
                                        </div>
                                    </div>

                                    {/* CONTENT WORKSPACE */}
                                    <div 
                                        id="dhanvij-word-editor"
                                        className="dw-editor"
                                        contentEditable={true}
                                        dangerouslySetInnerHTML={{ __html: editedContent }}
                                        onBlur={(e) => setEditedContent(e.target.innerHTML)}
                                        onKeyDown={handleEditorKeyDown}
                                        style={{ flex: 1, overflowY: 'auto', minHeight: '300px' }}
                                    ></div>
                                </div>
                        ) : (
                            selectedContract.type === 'manual' ? (
                                (() => {
                                    const mime = selectedContract.mimetype || '';
                                    const fileUrl = `${API_BASE_URL}${selectedContract.fileUrl}`;
                                    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                                    
                                    if (mime.startsWith('image/')) {
                                        return (
                                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '20px', overflow: 'hidden', marginBottom: '24px', minHeight: '500px' }}>
                                                <img src={fileUrl} alt="Agreement" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }} />
                                            </div>
                                        );
                                    } else if (mime === 'application/pdf') {
                                        return (
                                            <iframe 
                                                src={fileUrl} 
                                                style={{ flex: 1, width: '100%', minHeight: '700px', border: 'none', borderRadius: '12px', background: 'white', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} 
                                                title="PDF Preview"
                                            />
                                        );
                                    } else if (mime.includes('word') || mime.includes('officedocument') || selectedContract.originalName?.endsWith('.docx') || selectedContract.originalName?.endsWith('.doc')) {
                                        // High-fidelity Preview using Mammoth (Works in all environments)
                                        if (true) {
                                            if (wordPreviewLoading) {
                                                return (
                                                    <div style={{ flex: 1, minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div className="ua-loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                                        <p style={{ marginTop: '16px', color: '#94a3b8', fontSize: '14px' }}>Processing Document...</p>
                                                    </div>
                                                );
                                            }
                                            if (wordPreviewHtml) {
                                                if (wordPreviewHtml.includes('Failed to render')) {
                                                    return (
                                                        <div style={{ flex: 1, minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', marginBottom: '24px', padding: '40px', textAlign: 'center' }}>
                                                            <div dangerouslySetInnerHTML={{ __html: wordPreviewHtml }} />
                                                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                                                <button onClick={() => window.open(fileUrl, '_blank')} className="ua-btn" style={{ background: '#2563eb' }}>Open in New Tab</button>
                                                                <a href={fileUrl} download className="ua-btn" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>Download File</a>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return <div className="agreement-preview" dangerouslySetInnerHTML={{ __html: wordPreviewHtml }} style={{ marginBottom: '24px', overflow: 'auto', flex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />;
                                            }
                                            // Fallback if no HTML but not loading (Google Viewer Fallback)
                                            return (
                                                <div style={{ flex: 1, minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', marginBottom: '24px', padding: '40px', textAlign: 'center' }}>
                                                    <FileText size={60} style={{ color: '#334155', marginBottom: '20px' }} />
                                                    <h3 style={{ color: 'white', marginBottom: '10px' }}>Document Preview</h3>
                                                    <p style={{ color: '#94a3b8', maxWidth: '400px', marginBottom: '24px', fontSize: '14px' }}>
                                                        High-fidelity online preview is unavailable. You can open the file in a new tab or download it to view.
                                                    </p>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <button onClick={() => window.open(fileUrl, '_blank')} className="ua-btn" style={{ background: '#2563eb' }}>Open in New Tab</button>
                                                        <a href={fileUrl} download className="ua-btn" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>Download File</a>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <iframe 
                                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                                                style={{ flex: 1, width: '100%', minHeight: '700px', border: 'none', borderRadius: '12px', background: 'white', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} 
                                                title="Word Preview"
                                            />
                                        );
                                    } else if (selectedContract.content) {
                                        return <div className="agreement-preview" dangerouslySetInnerHTML={{ __html: selectedContract.content }} style={{ marginBottom: '24px', overflow: 'auto', flex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />;
                                    } else {
                                        return (
                                            <iframe 
                                                src={fileUrl} 
                                                style={{ flex: 1, width: '100%', minHeight: '700px', border: 'none', borderRadius: '12px', background: 'white', marginBottom: '24px' }} 
                                                title="Agreement Preview"
                                            />
                                        );
                                    }
                                })()
                            ) : (
                                <div className="agreement-preview" dangerouslySetInnerHTML={{ __html: selectedContract.content }} style={{ marginBottom: '24px', overflow: 'auto', flex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                            )
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', padding: '20px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: 'auto' }}>
                            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Admin:</span>
                                    {selectedContract.adminSigned ? (
                                        <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Signed</span>
                                    ) : (
                                        <span style={{ color: '#f87171', fontSize: '12px' }}>Pending</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Client:</span>
                                    {selectedContract.clientSigned ? (
                                        <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Signed</span>
                                    ) : (
                                        <span style={{ color: '#f87171', fontSize: '12px' }}>Pending</span>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                {selectedContract.fileUrl && !isEditing && (
                                    <a href={`${API_BASE_URL}${selectedContract.fileUrl}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }} download>
                                        <button style={{ padding: '8px 16px', background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.2)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                                            <Download size={16} /> Download
                                        </button>
                                    </a>
                                )}
                                {isEditing ? (
                                    <>
                                        <div style={{ marginRight: 'auto', fontSize: '12px', color: '#f87171', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <AlertCircle size={14} /> Saving will reset all signatures
                                        </div>
                                        <button onClick={() => setIsEditing(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Discard</button>
                                        <button onClick={handleUpdate} disabled={loading} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </>
                                ) : (
                                    selectedContract.status !== 'Active' && (
                                        <>
                                            <button 
                                                onClick={() => setIsEditing(true)}
                                                style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}
                                            >
                                                <Edit3 size={16} /> Edit Text
                                            </button>
                                            
                                            {((uploadedByRole === 'admin' && !selectedContract.adminSigned) ||
                                              (uploadedByRole === 'client' && !selectedContract.clientSigned)) && (
                                                <button 
                                                    onClick={() => handleSign(selectedContract._id)} 
                                                    style={{ padding: '8px 24px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                                                >
                                                    <PenTool size={16} /> Execute & Sign
                                                </button>
                                            )}
                                        </>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
