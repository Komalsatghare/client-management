import React, { useState } from 'react';
import { X, FileText, Send, Building, MapPin, Hash } from 'lucide-react';

const AgreementModal = ({ isOpen, onClose, onConfirm, projectTitle }) => {
    const [formData, setFormData] = useState({
        agreementNumber: '',
        clientAddress: '',
        meetingPlace: '',
        plotDetails: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container" style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <h3 className="modal-title">Generate Agreement</h3>
                    <button onClick={onClose} className="modal-close">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
                            Generating digital agreement for: <strong style={{ color: '#f1f5f9' }}>{projectTitle}</strong>
                        </p>
                        
                        <div className="form-group">
                            <label className="form-label"><Hash size={14} /> Agreement Number</label>
                            <input
                                type="text"
                                name="agreementNumber"
                                value={formData.agreementNumber}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g. AG-2024-001"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label"><Building size={14} /> Client Address</label>
                            <input
                                type="text"
                                name="clientAddress"
                                value={formData.clientAddress}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Full residential address"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label"><MapPin size={14} /> Place of Meeting</label>
                            <input
                                type="text"
                                name="meetingPlace"
                                value={formData.meetingPlace}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g. Office or Project Site"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label"><FileText size={14} /> Plot / Survey Number</label>
                            <input
                                type="text"
                                name="plotDetails"
                                value={formData.plotDetails}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g. Survey No. 121/B"
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            <Send size={16} style={{ marginRight: '8px' }} />
                            Generate Agreement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgreementModal;
