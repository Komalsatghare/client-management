import React, { useState, useEffect } from "react";
import { CreditCard, Search, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";
import { API_BASE_URL } from "../config";


const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@keyframes phFade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
@keyframes phSpin { to{transform:rotate(360deg)} }

.ph-root { font-family:'Inter',sans-serif; color:#e2e8f0; }

/* Summary cards */
.ph-summary-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:16px; margin-bottom:22px;
}
.ph-summary-card {
    background:rgba(15,23,42,0.85); backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.07); border-radius:18px;
    padding:22px 24px; transition:all .25s; animation:phFade .35s ease-out both;
    position:relative; overflow:hidden;
}
.ph-summary-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    border-radius:18px 18px 0 0;
}
.ph-summary-card.blue::before  { background:linear-gradient(90deg,#3b82f6,#6366f1); }
.ph-summary-card.green::before { background:linear-gradient(90deg,#10b981,#059669); }
.ph-summary-card.red::before   { background:linear-gradient(90deg,#f59e0b,#ef4444); }

.ph-summary-card:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(0,0,0,0.4); border-color:rgba(96,165,250,0.18); }
.ph-summary-label { font-size:11px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:.07em; margin-bottom:6px; }
.ph-summary-value { font-size:26px; font-weight:800; margin:0; line-height:1; }
.ph-summary-proj  { font-size:11px; color:#475569; margin-top:5px; }

/* Table card */
.ph-table-card {
    background:rgba(15,23,42,0.85); backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.07); border-radius:18px;
    overflow:hidden; animation:phFade .4s ease-out both;
}
.ph-table-head {
    padding:22px 24px; border-bottom:1px solid rgba(255,255,255,0.07);
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:12px;
    background:rgba(255,255,255,0.02);
}
.ph-table-title { font-size:18px; font-weight:800; color:#f1f5f9; margin:0; }
.ph-table-sub   { font-size:13px; color:#475569; margin:4px 0 0; }

.ph-search-wrap { position:relative; }
.ph-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#475569; pointer-events:none; }
.ph-search-inp  {
    padding:9px 14px 9px 36px; width:210px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; font-size:13px; outline:none; color:#e2e8f0;
    font-family:'Inter',sans-serif; transition:all .2s; color-scheme:dark;
}
.ph-search-inp::placeholder { color:#334155; }
.ph-search-inp:focus { border-color:rgba(96,165,250,0.4); background:rgba(96,165,250,0.05); box-shadow:0 0 0 3px rgba(96,165,250,0.1); }

.ph-table { width:100%; border-collapse:collapse; text-align:left; }
.ph-table th {
    padding:13px 20px;
    background:rgba(255,255,255,0.025);
    font-size:10px; font-weight:700; color:#475569;
    text-transform:uppercase; letter-spacing:.07em;
    border-bottom:1px solid rgba(255,255,255,0.06);
}
.ph-table td {
    padding:14px 20px; border-bottom:1px solid rgba(255,255,255,0.04);
    font-size:13px; color:#94a3b8;
}
.ph-table tr:last-child td { border-bottom:none; }
.ph-table tr:hover td { background:rgba(255,255,255,0.02); }

.ph-bill-id { font-weight:700; color:#60a5fa; font-family:monospace; font-size:13px; }
.ph-amount   { font-weight:700; color:#10b981; font-size:14px; }

.ph-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:999px;
    font-size:11px; font-weight:700;
}
.ph-badge.completed { color:#10b981; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); }
.ph-badge.pending   { color:#f59e0b; background:rgba(245,158,11,0.12);  border:1px solid rgba(245,158,11,0.3); }

.ph-dl-btn {
    display:inline-flex; align-items:center; gap:5px;
    padding:5px 11px; background:rgba(96,165,250,0.1); color:#60a5fa;
    border:1px solid rgba(96,165,250,0.2); border-radius:8px;
    font-size:12px; font-weight:600; text-decoration:none; transition:all .18s;
}
.ph-dl-btn:hover { background:rgba(96,165,250,0.18); transform:scale(1.04); }

.ph-empty { text-align:center; padding:40px; color:#475569; font-size:13px; }
`;

export default function PaymentHistory() {
    const { t } = useLanguage();
    const [payments, setPayments]   = useState([]);
    const [summaries, setSummaries] = useState([]);
    const [search, setSearch]       = useState("");

    useEffect(() => {
        const fetchClientPayments = async () => {
            try {
                const token = localStorage.getItem("authToken");
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

    const filtered = payments.filter(p =>
        p.billNumber.toLowerCase().includes(search.toLowerCase()) ||
        (p.projectId?.name?.toLowerCase().includes(search.toLowerCase()))
    );

    const totalBudget    = summaries.reduce((a, s) => a + (s.totalBudget   || 0), 0);
    const totalPaid      = summaries.reduce((a, s) => a + (s.totalPaid     || 0), 0);
    const totalRemaining = summaries.reduce((a, s) => a + (s.remainingAmount || 0), 0);

    return (
        <>
            <style>{css}</style>
            <div className="ph-root">

                {summaries.length > 0 && (
                    <div className="ph-summary-grid">
                        <div className="ph-summary-card blue">
                            <p className="ph-summary-label">{t('total_budget') || "Total Budget"}</p>
                            <p className="ph-summary-value" style={{ color:"#60a5fa" }}>₹{totalBudget.toLocaleString()}</p>
                            <p className="ph-summary-proj">{summaries.length} {t('projects_count') || "projects"}</p>
                        </div>
                        <div className="ph-summary-card green">
                            <p className="ph-summary-label">{t('amount_paid') || "Amount Paid"}</p>
                            <p className="ph-summary-value" style={{ color:"#10b981" }}>₹{totalPaid.toLocaleString()}</p>
                            <p className="ph-summary-proj">{payments.filter(p => p.paymentStatus === "completed").length} {t('transactions_count') || "transactions"}</p>
                        </div>
                        <div className="ph-summary-card red">
                            <p className="ph-summary-label">{t('balance_due') || "Balance Due"}</p>
                            <p className="ph-summary-value" style={{ color: totalRemaining > 0 ? "#f87171" : "#10b981" }}>₹{totalRemaining.toLocaleString()}</p>
                            <p className="ph-summary-proj">{totalRemaining > 0 ? (t('outstanding_balance') || "Outstanding balance") : (t('fully_paid') || "Fully paid ✓")}</p>
                        </div>
                    </div>
                )}

                <div className="ph-table-card">
                    <div className="ph-table-head">
                        <div>
                            <h2 className="ph-table-title">{t('payment_transactions_title') || "Payment Transactions"}</h2>
                            <p className="ph-table-sub">{t('track_payments_desc') || "View and download your billing history"}</p>
                        </div>
                        <div className="ph-search-wrap">
                            <Search size={14} className="ph-search-icon" />
                            <input type="text" placeholder={t('search_invoices') || "Search invoices…"}
                                className="ph-search-inp"
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ overflowX:"auto" }}>
                        <table className="ph-table">
                            <thead>
                                <tr>
                                    <th>{t('invoice_id') || "Invoice ID"}</th>
                                    <th>{t('date') || "Date"}</th>
                                    <th>{t('project') || "Project"}</th>
                                    <th>{t('amount') || "Amount"}</th>
                                    <th>{t('method') || "Method"}</th>
                                    <th style={{ textAlign:"center" }}>{t('receipt') || "Receipt"}</th>
                                    <th style={{ textAlign:"right" }}>{t('status') || "Status"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="7" className="ph-empty">{t('no_transactions') || "No transactions found."}</td></tr>
                                ) : (
                                    filtered.map(req => (
                                        <tr key={req._id}>
                                            <td><span className="ph-bill-id">#{req.billNumber}</span></td>
                                            <td>{new Date(req.paymentDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</td>
                                            <td style={{ color:"#e2e8f0", fontWeight:500 }}>{req.projectId?.name || "N/A"}</td>
                                            <td><span className="ph-amount">₹{Number(req.amount).toLocaleString()}</span></td>
                                            <td>
                                                <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, color:"#64748b" }}>
                                                    <CreditCard size={12} />{req.paymentMode}
                                                </span>
                                            </td>
                                            <td style={{ textAlign:"center" }}>
                                                <a href={`${API_BASE_URL}${req.billFile}`} target="_blank" rel="noopener noreferrer" className="ph-dl-btn">
                                                    <Download size={13} /> PDF
                                                </a>
                                            </td>
                                            <td style={{ textAlign:"right" }}>
                                                <span className={`ph-badge ${req.paymentStatus === "completed" ? "completed" : "pending"}`}>
                                                    {req.paymentStatus === "completed" && <CheckCircle size={11} />}
                                                    {req.paymentStatus === "pending" && <AlertCircle size={11} />}
                                                    {req.paymentStatus === "completed" ? (t('completed') || "Completed") : (t('pending') || "Pending")}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
