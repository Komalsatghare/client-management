import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MessageSquare, Trash2, CheckCircle, Clock, Mail, Phone, Tag, Send, X, Inbox } from "lucide-react";

/* ─── CSS ───────────────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.inq-root { padding:28px; max-width:900px; margin:0 auto; font-family:'Inter',sans-serif; color:#e2e8f0; }

/* Card */
.inq-card {
    background:rgba(15,23,42,0.8);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:16px;
    overflow:hidden;
    transition:border-color .25s, box-shadow .25s;
    backdrop-filter:blur(10px);
    animation:inqFadeIn .3s ease-out both;
}
.inq-card:hover { border-color:rgba(96,165,250,0.2); box-shadow:0 8px 32px rgba(0,0,0,0.35); }
@keyframes inqFadeIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }

/* Avatar */
.inq-avatar {
    width:42px; height:42px; border-radius:12px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-weight:800; font-size:17px; color:white;
    background:linear-gradient(135deg,#3b82f6,#7c3aed);
    box-shadow:0 4px 14px rgba(99,102,241,0.35);
}

/* Service tag */
.inq-service-tag {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 11px; border-radius:7px; font-size:12px; font-weight:600;
    background:rgba(59,130,246,0.12); color:#60a5fa;
    border:1px solid rgba(59,130,246,0.25);
}

/* Status badge */
.inq-badge {
    padding:4px 12px; border-radius:999px;
    font-size:11px; font-weight:700; letter-spacing:.03em;
    white-space:nowrap; display:inline-flex; align-items:center; gap:5px;
}

/* Reply box */
.inq-reply-box {
    background:rgba(10,185,129,0.06);
    border:1px solid rgba(16,185,129,0.2);
    border-radius:12px;
    padding:14px 16px;
    margin-top:14px;
    animation:inqFadeIn .2s ease-out;
}

/* Reply textarea */
.inq-textarea {
    width:100%; box-sizing:border-box;
    padding:11px 14px;
    border:1px solid rgba(255,255,255,0.1);
    border-radius:10px; font-size:13px; outline:none;
    background:rgba(255,255,255,0.04); color:#e2e8f0;
    font-family:'Inter',sans-serif; line-height:1.6;
    resize:vertical; transition:all .2s; color-scheme:dark;
}
.inq-textarea::placeholder { color:#475569; }
.inq-textarea:focus { border-color:rgba(96,165,250,0.4); background:rgba(96,165,250,0.05); box-shadow:0 0 0 3px rgba(96,165,250,0.1); }

/* Draft reply input area */
.inq-draft-area { margin-top:14px; animation:inqFadeIn .2s ease-out; }

/* Footer actions */
.inq-footer {
    padding:12px 22px;
    border-top:1px solid rgba(255,255,255,0.06);
    display:flex; gap:8px;
    background:rgba(255,255,255,0.015);
}
.inq-btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 16px; border-radius:9px;
    font-size:13px; font-weight:600; cursor:pointer;
    font-family:'Inter',sans-serif; border:none; transition:all .2s;
}
.inq-btn:hover { transform:scale(1.03); }
.inq-btn-reply  { background:rgba(96,165,250,0.12); color:#60a5fa; border:1px solid rgba(96,165,250,0.25) !important; }
.inq-btn-reply:hover  { background:rgba(96,165,250,0.2); }
.inq-btn-close  { background:rgba(255,255,255,0.05); color:#94a3b8; border:1px solid rgba(255,255,255,0.1) !important; }
.inq-btn-close:hover  { background:rgba(255,255,255,0.09); color:#e2e8f0; }
.inq-btn-delete { background:rgba(239,68,68,0.1); color:#f87171; border:1px solid rgba(239,68,68,0.2) !important; }
.inq-btn-delete:hover { background:rgba(239,68,68,0.18); }
.inq-btn-send   { background:linear-gradient(135deg,#3b82f6,#6366f1); color:white; box-shadow:0 4px 14px rgba(99,102,241,0.3); }
.inq-btn-send:hover   { box-shadow:0 6px 20px rgba(99,102,241,0.45); }
.inq-btn-send:disabled{ opacity:.6; cursor:not-allowed; transform:none; }

/* Search */
.inq-search-wrap { position:relative; }
.inq-search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#475569; pointer-events:none; }
.inq-search-inp {
    width:100%; padding:10px 14px 10px 38px; box-sizing:border-box;
    border:1px solid rgba(255,255,255,0.1); border-radius:10px;
    font-size:13px; outline:none;
    background:rgba(255,255,255,0.04); color:#e2e8f0;
    font-family:'Inter',sans-serif; transition:all .2s; color-scheme:dark;
}
.inq-search-inp::placeholder { color:#475569; }
.inq-search-inp:focus { border-color:rgba(96,165,250,0.4); background:rgba(96,165,250,0.05); box-shadow:0 0 0 3px rgba(96,165,250,0.1); }

/* Filter chip */
.inq-chip {
    padding:7px 16px; border-radius:999px;
    font-size:12px; font-weight:600; cursor:pointer;
    border:1px solid transparent; transition:all .2s;
    font-family:'Inter',sans-serif;
}
.inq-chip.active { background:rgba(96,165,250,0.15); color:#60a5fa; border-color:rgba(96,165,250,0.3); }
.inq-chip:not(.active) { background:rgba(255,255,255,0.04); color:#64748b; border-color:rgba(255,255,255,0.08); }
.inq-chip:not(.active):hover { background:rgba(255,255,255,0.08); color:#94a3b8; }

/* Empty */
.inq-empty { text-align:center; padding:64px 32px; background:rgba(15,23,42,0.6); border-radius:16px; border:1px solid rgba(255,255,255,0.06); color:#475569; }
.inq-loading { text-align:center; padding:64px; color:#475569; font-size:14px; }
.inq-spinner { width:32px; height:32px; border:3px solid rgba(255,255,255,0.07); border-top-color:#60a5fa; border-radius:50%; animation:inqSpin .8s linear infinite; margin:0 auto 16px; }
@keyframes inqSpin { to{transform:rotate(360deg);} }
`;

/* ─── Component ─────────────────────────────────────────────────────────────── */
const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [replyText, setReplyText] = useState({});
    const [replyOpen, setReplyOpen] = useState({});
    const [sending, setSending]     = useState(null);
    const [search, setSearch]       = useState("");
    const [filter, setFilter]       = useState("All");

    useEffect(() => { fetchInquiries(); }, []);

    const fetchInquiries = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/inquiries");
            setInquiries(res.data);
        } catch (err) {
            console.error("Failed to fetch inquiries:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this inquiry?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/inquiries/${id}`);
            fetchInquiries();
        } catch {
            alert("Failed to delete inquiry.");
        }
    };

    const toggleReply = (id) => {
        setReplyOpen(prev => ({ ...prev, [id]: !prev[id] }));
        if (!replyText[id]) setReplyText(prev => ({ ...prev, [id]: "" }));
    };

    const handleSendReply = async (inquiry) => {
        const text = replyText[inquiry._id]?.trim();
        if (!text) { alert("Please enter a reply message."); return; }
        setSending(inquiry._id);
        try {
            await axios.put(`http://localhost:5000/api/inquiries/${inquiry._id}/reply`, { reply: text });
            fetchInquiries();
            setReplyOpen(prev => ({ ...prev, [inquiry._id]: false }));
        } catch {
            alert("Failed to send reply.");
        } finally {
            setSending(null);
        }
    };

    /* Filtered list */
    const filtered = inquiries.filter(inq => {
        const matchSearch = search === "" ||
            `${inq.firstName} ${inq.lastName} ${inq.email} ${inq.service} ${inq.message}`
                .toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "All" ||
            (filter === "Replied" ? inq.status === "Replied" : inq.status !== "Replied");
        return matchSearch && matchFilter;
    });

    const newCount      = inquiries.filter(i => i.status !== "Replied").length;
    const repliedCount  = inquiries.filter(i => i.status === "Replied").length;

    return (
        <>
            <style>{css}</style>
            <div className="inq-root">

                {/* ── Header ── */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"14px", marginBottom:"24px" }}>
                    <div>
                        <h1 style={{ margin:0, fontSize:"24px", fontWeight:800, background:"linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                            Website Inquiries
                        </h1>
                        <p style={{ margin:"5px 0 0", fontSize:"13px", color:"#64748b" }}>
                            View and reply to enquiries submitted via the contact form
                        </p>
                    </div>
                    {/* Stats chips */}
                    <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                        <div style={{ padding:"8px 16px", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:"10px", textAlign:"center" }}>
                            <p style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#f59e0b" }}>{newCount}</p>
                            <p style={{ margin:0, fontSize:"11px", color:"#64748b", textTransform:"uppercase", letterSpacing:".05em" }}>New</p>
                        </div>
                        <div style={{ padding:"8px 16px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:"10px", textAlign:"center" }}>
                            <p style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#10b981" }}>{repliedCount}</p>
                            <p style={{ margin:0, fontSize:"11px", color:"#64748b", textTransform:"uppercase", letterSpacing:".05em" }}>Replied</p>
                        </div>
                    </div>
                </div>

                {/* ── Search + Filter bar ── */}
                <div style={{ display:"flex", gap:"12px", marginBottom:"20px", flexWrap:"wrap" }}>
                    <div className="inq-search-wrap" style={{ flex:1, minWidth:"200px" }}>
                        <Search size={15} className="inq-search-icon" />
                        <input type="text" placeholder="Search by name, email, service…"
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="inq-search-inp" />
                    </div>
                    <div style={{ display:"flex", gap:"6px" }}>
                        {["All","New","Replied"].map(f => (
                            <button key={f} className={`inq-chip${filter===f?" active":""}`} onClick={() => setFilter(f)}>{f}</button>
                        ))}
                    </div>
                </div>

                {/* ── States ── */}
                {loading && (
                    <div className="inq-loading">
                        <div className="inq-spinner" />
                        Loading inquiries…
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="inq-empty">
                        <Inbox size={40} style={{ color:"#334155", margin:"0 auto 14px", display:"block" }} />
                        <p style={{ fontWeight:700, color:"#475569", margin:"0 0 6px" }}>
                            {inquiries.length === 0 ? "No inquiries yet" : "No results found"}
                        </p>
                        <p style={{ fontSize:"13px", color:"#334155", margin:0 }}>
                            {inquiries.length === 0
                                ? "Inquiries submitted on the website will appear here."
                                : "Try adjusting your search or filter."}
                        </p>
                    </div>
                )}

                {/* ── Cards ── */}
                {!loading && (
                    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                        {filtered.map((inquiry, i) => {
                            const isReplied = inquiry.status === "Replied";
                            const sc = isReplied
                                ? { c:"#10b981", b:"rgba(16,185,129,0.12)", bdr:"rgba(16,185,129,0.3)" }
                                : { c:"#f59e0b", b:"rgba(245,158,11,0.12)",  bdr:"rgba(245,158,11,0.3)"  };
                            const initials = (inquiry.firstName?.charAt(0) || "?").toUpperCase();
                            const gradients = [
                                "linear-gradient(135deg,#3b82f6,#7c3aed)",
                                "linear-gradient(135deg,#06b6d4,#3b82f6)",
                                "linear-gradient(135deg,#f59e0b,#ef4444)",
                                "linear-gradient(135deg,#10b981,#3b82f6)",
                            ];

                            return (
                                <div key={inquiry._id} className="inq-card" style={{ animationDelay:`${i*0.05}s` }}>

                                    {/* Card Header */}
                                    <div style={{ padding:"18px 22px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"12px" }}>
                                        <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                                            <div className="inq-avatar" style={{ background: gradients[i%gradients.length] }}>{initials}</div>
                                            <div>
                                                <p style={{ margin:0, fontWeight:700, fontSize:"15px", color:"#f1f5f9" }}>
                                                    {inquiry.firstName} {inquiry.lastName}
                                                </p>
                                                <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginTop:"3px" }}>
                                                    <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"12px", color:"#64748b" }}>
                                                        <Mail size={11} /> {inquiry.email}
                                                    </span>
                                                    {inquiry.phone && (
                                                        <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"12px", color:"#64748b" }}>
                                                            <Phone size={11} /> {inquiry.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
                                            <span className="inq-badge" style={{ color:sc.c, background:sc.b, border:`1px solid ${sc.bdr}` }}>
                                                {isReplied ? <CheckCircle size={11} /> : <Clock size={11} />}
                                                {inquiry.status || "New"}
                                            </span>
                                            <span style={{ fontSize:"11px", color:"#475569" }}>
                                                {new Date(inquiry.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div style={{ padding:"16px 22px" }}>
                                        {/* Service tag */}
                                        {inquiry.service && (
                                            <div style={{ marginBottom:"12px", display:"flex", alignItems:"center", gap:"8px" }}>
                                                <span className="inq-service-tag"><Tag size={11} />{inquiry.service}</span>
                                                <span style={{ fontSize:"12px", color:"#475569" }}>Service Requested</span>
                                            </div>
                                        )}

                                        {/* Message */}
                                        <p style={{ margin:0, fontSize:"14px", color:"#94a3b8", lineHeight:"1.65" }}>
                                            {inquiry.message}
                                        </p>

                                        {/* Existing reply */}
                                        {inquiry.reply && (
                                            <div className="inq-reply-box">
                                                <p style={{ margin:"0 0 6px", fontSize:"11px", fontWeight:700, color:"#10b981", textTransform:"uppercase", letterSpacing:".05em", display:"flex", alignItems:"center", gap:"5px" }}>
                                                    <CheckCircle size={11} />
                                                    Your Reply
                                                    {inquiry.repliedAt && (
                                                        <span style={{ fontWeight:400, color:"#475569", textTransform:"none", letterSpacing:0 }}>
                                                            · {new Date(inquiry.repliedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </p>
                                                <p style={{ margin:0, fontSize:"13px", color:"#6ee7b7", lineHeight:"1.6" }}>{inquiry.reply}</p>
                                            </div>
                                        )}

                                        {/* Reply draft textarea */}
                                        {replyOpen[inquiry._id] && (
                                            <div className="inq-draft-area">
                                                <textarea rows={3}
                                                    placeholder="Type your reply to this enquiry…"
                                                    value={replyText[inquiry._id] || ""}
                                                    onChange={e => setReplyText(prev => ({ ...prev, [inquiry._id]: e.target.value }))}
                                                    className="inq-textarea"
                                                />
                                                <div style={{ display:"flex", gap:"8px", marginTop:"8px" }}>
                                                    <button onClick={() => handleSendReply(inquiry)}
                                                        disabled={sending === inquiry._id}
                                                        className="inq-btn inq-btn-send">
                                                        <Send size={13} />
                                                        {sending === inquiry._id ? "Sending…" : "Send Reply"}
                                                    </button>
                                                    <button onClick={() => toggleReply(inquiry._id)}
                                                        className="inq-btn inq-btn-close">
                                                        <X size={13} /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="inq-footer">
                                        <button onClick={() => toggleReply(inquiry._id)}
                                            className={`inq-btn ${replyOpen[inquiry._id] ? "inq-btn-close" : "inq-btn-reply"}`}>
                                            <MessageSquare size={13} />
                                            {replyOpen[inquiry._id] ? "Close" : inquiry.reply ? "Update Reply" : "Reply"}
                                        </button>
                                        <button onClick={() => handleDelete(inquiry._id)}
                                            className="inq-btn inq-btn-delete">
                                            <Trash2 size={13} /> Delete
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default Inquiries;
