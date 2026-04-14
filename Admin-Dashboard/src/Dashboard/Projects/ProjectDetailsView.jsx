import React, { useState } from "react";
import axios from 'axios';
import { Download, X, Maximize2, Save } from 'lucide-react';
import { API_BASE_URL, resolveUrl } from "../../config";

const ProjectDetailsView = ({ project, goBack, onImageClick }) => {
  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split('/').pop() || 'project-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download image.");
    }
  };

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: 'Bank Transfer',
    notes: ''
  });

  // Financial Editing State
  const [isEditingFinancials, setIsEditingFinancials] = useState(false);
  const [finData, setFinData] = useState({
    totalBudget: project.totalBudget || project.budget || 0,
    totalPaid: project.totalPaid || 0,
    remainingAmount: project.remainingAmount || (Number(project.budget) || 0),
    locationLink: project.locationLink || ''
  });
  const [isSavingFin, setIsSavingFin] = useState(false);

  const handleFinancialChange = (e) => {
    const { name, value } = e.target;
    const newVal = Number(value);

    setFinData(prev => {
      const updated = { ...prev, [name]: newVal };
      // Auto-calculate remaining
      if (name === 'totalBudget' || name === 'totalPaid') {
        updated.remainingAmount = updated.totalBudget - updated.totalPaid;
      }
      return updated;
    });
  };

  const saveFinancials = async () => {
    try {
      setIsSavingFin(true);
      const token = localStorage.getItem("authToken");
      await axios.put(`${API_BASE_URL}/api/projects/${project._id}`, finData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Financial details updated successfully!");
      setIsEditingFinancials(false);
      // Normally we'd refresh the project object here
      // Update local object to reflect change in current view
      project.totalBudget = finData.totalBudget;
      project.totalPaid = finData.totalPaid;
      project.remainingAmount = finData.remainingAmount;
      project.locationLink = finData.locationLink;
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSavingFin(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${API_BASE_URL}/api/payments`, {
        projectId: project._id,
        clientId: project.clientId,
        amount: Number(paymentData.amount),
        paymentMode: paymentData.paymentMode,
        notes: paymentData.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Payment recorded successfully! Invoice generated.");
      setIsPaymentModalOpen(false);

      // Update amount paid dynamically
      const newPaid = Number(project.totalPaid || 0) + Number(paymentData.amount);
      const newRemaining = Number(project.totalBudget || project.budget || 0) - newPaid;

      project.totalPaid = newPaid;
      project.remainingAmount = newRemaining;

      setPaymentData({ amount: '', paymentMode: 'Bank Transfer', notes: '' });
      setFinData({ totalBudget: project.totalBudget, totalPaid: newPaid, remainingAmount: newRemaining });
    } catch (err) {
      console.error("Failed to record payment", err);
      alert("Failed to record payment. Please try again.");
    }
  };

  return (
    <div className="details-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <button
        className="back-btn"
        onClick={goBack}
        style={{ marginBottom: '20px', padding: '8px 16px', border: 'none', borderRadius: '5px', backgroundColor: '#6c757d', color: 'white', cursor: 'pointer' }}
      >
        &larr; Back to Projects
      </button>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '25px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>
            {project.name}
          </h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              + Add Payment / Bill
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <p style={{ margin: '10px 0', color: '#555' }}><strong style={{ color: '#222' }}>Client:</strong> {project.clientId?.name || project.client || 'N/A'}</p>
            <p style={{ margin: '10px 0', color: '#555' }}><strong style={{ color: '#222' }}>Status:</strong>
              <span style={{
                marginLeft: '8px', padding: '4px 10px', borderRadius: '15px', fontSize: '14px',
                background: project.status === 'Active' ? '#d4edda' : project.status === 'Completed' ? '#cce5ff' : '#fff3cd',
                color: project.status === 'Active' ? '#155724' : project.status === 'Completed' ? '#004085' : '#856404'
              }}>
                {project.status}
              </span>
            </p>
            <p style={{ margin: '10px 0', color: '#555' }}>
              <strong style={{ color: '#222' }}>Payment:</strong>
              <span style={{ marginLeft: '8px', fontWeight: 'bold', color: project.paymentStatus === 'completed' ? '#28a745' : project.paymentStatus === 'partial' ? '#fd7e14' : '#dc3545' }}>
                {project.paymentStatus ? project.paymentStatus.toUpperCase() : 'PENDING'}
              </span>
            </p>
            {project.locationLink && (
              <p style={{ margin: '10px 0', color: '#555' }}>
                <strong style={{ color: '#222' }}>Location:</strong>
                <a 
                  href={project.locationLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ marginLeft: '8px', color: '#007bff', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  🌍 View on Maps
                </a>
              </p>
            )}
          </div>

          <div>
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef', marginBottom: '15px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Project Finances</h4>
                <button
                  onClick={() => isEditingFinancials ? saveFinancials() : setIsEditingFinancials(true)}
                  disabled={isSavingFin}
                  style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {isSavingFin ? 'Saving...' : isEditingFinancials ? 'Save Changes' : 'Edit Fields'}
                </button>
              </div>

              {isEditingFinancials ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', color: '#475569' }}>Total Budget:</label>
                    <input
                      type="number"
                      name="totalBudget"
                      value={finData.totalBudget}
                      onChange={handleFinancialChange}
                      style={{ width: '100px', padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', color: '#475569' }}>Amount Paid:</label>
                    <input
                      type="number"
                      name="totalPaid"
                      value={finData.totalPaid}
                      onChange={handleFinancialChange}
                      style={{ width: '100px', padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '4px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 800, color: '#dc3545' }}>Remaining:</label>
                    <input
                      type="number"
                      name="remainingAmount"
                      value={finData.remainingAmount}
                      onChange={handleFinancialChange}
                      style={{ width: '100px', padding: '4px', borderRadius: '4px', border: '1px solid #dc3545' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    <label style={{ fontSize: '12px', color: '#64748b' }}>Location Link:</label>
                    <input
                      type="text"
                      name="locationLink"
                      placeholder="Google Maps Link"
                      value={finData.locationLink}
                      onChange={handleFinancialChange}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ margin: '5px 0', color: '#555', fontSize: '14px' }}><strong style={{ color: '#222' }}>Total Budget:</strong> ₹{project.totalBudget || project.budget || 0}</p>
                  <p style={{ margin: '5px 0', color: '#555', fontSize: '14px' }}><strong style={{ color: '#222' }}>Amount Paid:</strong> ₹{project.totalPaid || 0}</p>
                  <p style={{ margin: '5px 0', color: '#dc3545', fontSize: '14px', fontWeight: 'bold' }}><strong style={{ color: '#222' }}>Remaining:</strong> ₹{project.remainingAmount || (Number(project.budget) || 0)}</p>
                </>
              )}
            </div>
            <p style={{ margin: '6px 0', color: '#64748b', fontSize: '13px' }}><strong>Exp. Deadline:</strong> {project.deadline || 'N/A'}</p>
          </div>
        </div>

        {project.notes && (
          <div style={{ marginBottom: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #007bff' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Project Notes</h4>
            <p style={{ margin: 0, color: '#555', lineHeight: '1.5', fontSize: '14px' }}>{project.notes}</p>
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333', fontSize: '16px' }}>Attached Images</h3>
          {project.images && project.images.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {project.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => onImageClick(resolveUrl(img))}
                  style={{
                    width: '200px', height: '150px', borderRadius: '8px', overflow: 'hidden',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', border: '1px solid #ddd',
                    cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
                  }}
                  className="project-img-thumb"
                >
                  <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: 0, gap: '15px' }} className="img-overlay">
                    <Maximize2 size={24} style={{ cursor: 'pointer', pointerEvents: 'auto' }} onClick={(e) => { e.stopPropagation(); onImageClick(resolveUrl(img)); }} />
                    <Download size={24} style={{ cursor: 'pointer', pointerEvents: 'auto' }} onClick={(e) => { e.stopPropagation(); downloadImage(resolveUrl(img)); }} />
                  </div>
                  <img
                    src={resolveUrl(img)}
                    alt={`Project Img ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/1e293b/94a3b8?text=Image+Not+Found'; }}
                  />
                  <style>{`
                    .project-img-thumb:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
                    .project-img-thumb:hover .img-overlay { background: rgba(0,0,0,0.3); opacity: 1; }
                  `}</style>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>No images uploaded for this project.</p>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>💰 Record Payment / Generate Bill</h2>
            <form onSubmit={handlePaymentSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Payment Mode</label>
                <select
                  value={paymentData.paymentMode}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI / GPay">UPI / GPay</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Description / Bill Notes</label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  placeholder="e.g. Second installment for foundation work..."
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', minHeight: '80px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#e0e0e0', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#28a745', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>💾 Save & Generate Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsView;
