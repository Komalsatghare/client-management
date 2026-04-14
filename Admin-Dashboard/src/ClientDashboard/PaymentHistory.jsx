import React, { useState, useEffect } from "react";
import { CheckCircle2, Search, Download, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { API_BASE_URL } from "../config";

export default function PaymentHistory() {
    const { t } = useLanguage();
    const [payments, setPayments] = useState([]);
    const [summaries, setSummaries] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchClientPayments = async () => {
            try {
                const token = localStorage.getItem("authToken");
                // The client ID is usually stored in localStorage during login
                const clientDataStr = localStorage.getItem("clientData");
                if (clientDataStr) {
                    const clientData = JSON.parse(clientDataStr);
                    const res = await axios.get(`${API_BASE_URL}/api/payments/client/${clientData.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setPayments(res.data.payments);
                    setSummaries(res.data.projectSummaries);
                }
            } catch (err) {
                console.error("Failed to fetch client payments:", err);
            }
        };
        fetchClientPayments();
    }, []);

    const filteredPayments = payments.filter(p =>
        p.billNumber.toLowerCase().includes(search.toLowerCase()) ||
        (p.projectId && p.projectId.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="client-table-container">
            {/* Payment Summaries */}
            {summaries.length > 0 && (
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    {summaries.map(proj => (
                        <div key={proj._id} style={{ flex: '1 1 300px', background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>{proj.name}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#64748b' }}>{t('total_budget') || "Total Budget"}:</span>
                                <span style={{ fontWeight: '600', color: '#334155' }}>₹{proj.totalBudget || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#64748b' }}>{t('amount_paid') || "Amount Paid"}:</span>
                                <span style={{ fontWeight: '600', color: '#10b981' }}>₹{proj.totalPaid || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                                <span style={{ color: '#64748b', fontWeight: '500' }}>{t('balance_due') || "Balance Due"}:</span>
                                <span style={{ fontWeight: '700', color: '#ef4444' }}>₹{proj.remainingAmount || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="client-table-header">
                <div>
                    <h2 className="client-table-title">{t('payment_history') || "Payment Transactions"}</h2>
                    <p className="client-table-sub">{t('track_payments_desc') || "View and download your billing history"}</p>
                </div>
                <div className="client-search-wrapper">
                    <Search className="client-search-icon" size={16} />
                    <input
                        type="text"
                        placeholder={t('search_invoices') || "Search invoices..."}
                        className="client-search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="client-table-responsive">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>{t('invoice_id') || "Invoice ID"}</th>
                            <th>{t('date') || "Date"}</th>
                            <th>{t('project') || "Project"}</th>
                            <th>{t('amount') || "Amount"}</th>
                            <th>{t('method') || "Method"}</th>
                            <th style={{ textAlign: "center" }}>{t('receipt') || "Download"}</th>
                            <th style={{ textAlign: "right" }}>{t('status') || "Status"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                    {t('no_transactions') || "No transaction history found."}
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((req) => (
                                <tr key={req._id}>
                                    <td style={{ fontWeight: '600', color: '#3b82f6' }}>{req.billNumber}</td>
                                    <td>{new Date(req.paymentDate).toLocaleDateString()}</td>
                                    <td>{req.projectId?.name || 'N/A'}</td>
                                    <td style={{ fontWeight: '600', color: '#10b981' }}>₹{req.amount}</td>
                                    <td>{req.paymentMode}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a href={req.billFile?.startsWith('http') ? req.billFile : `${API_BASE_URL}${req.billFile}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                                            <Download size={16} /> PDF
                                        </a>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <span className={req.paymentStatus === 'completed' ? 'client-status-completed' : 'client-status-pending'}>
                                            {req.paymentStatus === 'completed' && <CheckCircle size={12} />}
                                            {req.paymentStatus === 'pending' && <AlertCircle size={12} />}
                                            {req.paymentStatus === 'completed' ? (t('completed') || "Completed") : (t('pending') || "Pending")}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
