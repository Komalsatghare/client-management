import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ id: '', amount: '', paymentMode: '', notes: '' });

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get('http://localhost:5000/api/payments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(res.data);
        } catch (err) {
            console.error("Failed to fetch payments:", err);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this payment? This will alter project budgets.")) return;
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:5000/api/payments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPayments();
        } catch (err) {
            console.error("Failed to delete payment:", err);
            alert("Failed to delete payment");
        }
    };

    const handleEditClick = (payment) => {
        setEditData({
            id: payment._id,
            amount: payment.amount,
            paymentMode: payment.paymentMode,
            notes: payment.notes || ''
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`http://localhost:5000/api/payments/${editData.id}`, {
                amount: editData.amount,
                paymentMode: editData.paymentMode,
                notes: editData.notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditModalOpen(false);
            fetchPayments();
            alert("Payment updated successfully! PDF invoice regenerated.");
        } catch (err) {
            console.error("Failed to update payment:", err);
            alert("Failed to update payment");
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Payment History & Invoices</h2>

            <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Date</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Bill No.</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Client</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Project</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Amount</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Mode</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#555' }}>Invoice</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#555' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
                                    No payments recorded yet.
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#007bff' }}>{payment.billNumber}</td>
                                    <td style={{ padding: '12px' }}>{payment.clientId?.name || 'Unknown'}</td>
                                    <td style={{ padding: '12px' }}>{payment.projectId?.name || 'Unknown'}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#28a745' }}>₹{payment.amount}</td>
                                    <td style={{ padding: '12px' }}>{payment.paymentMode}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <a
                                            href={`http://localhost:5000${payment.billFile}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-block',
                                                padding: '6px 12px',
                                                background: '#17a2b8',
                                                color: 'white',
                                                textDecoration: 'none',
                                                borderRadius: '4px',
                                                fontSize: '13px'
                                            }}
                                        >
                                            Download PDF
                                        </a>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => handleEditClick(payment)}
                                                style={{ padding: '5px 10px', border: 'none', background: '#e0a800', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(payment._id)}
                                                style={{ padding: '5px 10px', border: 'none', background: '#c82333', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Payment Modal */}
            {isEditModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '400px' }}>
                        <h2 style={{ marginTop: 0 }}>Edit Payment</h2>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Updating the payment will automatically regenerate the PDF invoice and alter the project totals.</p>
                        <form onSubmit={handleEditSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Amount (₹) *</label>
                                <input
                                    type="number"
                                    required
                                    value={editData.amount}
                                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Mode *</label>
                                <select
                                    value={editData.paymentMode}
                                    onChange={(e) => setEditData({ ...editData, paymentMode: e.target.value })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Notes (Optional)</label>
                                <textarea
                                    rows="2"
                                    value={editData.notes}
                                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '8px 15px', border: 'none', background: '#dc3545', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 15px', border: 'none', background: '#28a745', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Update Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
