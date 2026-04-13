import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Plus, CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react';
import { API_BASE_URL } from '../../config';


/* ─── Inline Styles ─────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.tp-root { padding:28px; max-width:900px; margin:0 auto; font-family:'Inter',sans-serif; color:#e2e8f0; }

/* Cards */
.tp-card {
    background:rgba(15,23,42,0.8);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:16px;
    overflow:hidden;
    transition:border-color .25s, box-shadow .25s;
    margin-bottom:16px;
    backdrop-filter:blur(10px);
}
.tp-card:hover { border-color:rgba(96,165,250,0.2); box-shadow:0 8px 32px rgba(0,0,0,0.35); }

/* Card Header */
.tp-card-header {
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:18px 22px;
    cursor:pointer;
    user-select:none;
    gap:12px;
    transition:background .2s;
}
.tp-card-header:hover { background:rgba(255,255,255,0.02); }

/* Progress bar */
.tp-progress-track {
    height:4px;
    background:rgba(255,255,255,0.07);
    border-radius:999px;
    overflow:hidden;
    margin-top:8px;
}
.tp-progress-fill {
    height:100%;
    border-radius:999px;
    background:linear-gradient(90deg,#3b82f6,#8b5cf6);
    transition:width .6s ease;
}

/* Status badge */
.tp-status-badge {
    padding:4px 13px;
    border-radius:999px;
    font-size:11px;
    font-weight:700;
    letter-spacing:.03em;
    white-space:nowrap;
}

/* Expanded body */
.tp-expanded-body {
    padding:0 22px 22px;
    border-top:1px solid rgba(255,255,255,0.06);
    animation:expandIn .2s ease-out;
}
@keyframes expandIn { from{opacity:0;transform:translateY(-6px);} to{opacity:1;transform:translateY(0);} }

/* Timeline */
.tp-timeline {
    position:relative;
    padding-left:28px;
    border-left:2px solid rgba(255,255,255,0.08);
    display:flex;
    flex-direction:column;
    gap:22px;
}
.tp-timeline-item { position:relative; }
.tp-timeline-dot {
    position:absolute;
    left:-36px;
    top:4px;
    width:12px;
    height:12px;
    border-radius:50%;
    border:2px solid #0a0f1e;
    z-index:1;
    transition:box-shadow .2s;
}
.tp-timeline-item:hover .tp-timeline-dot { box-shadow:0 0 0 4px rgba(96,165,250,0.2); }
.tp-ms-title {
    font-weight:700;
    font-size:14px;
    color:#f1f5f9;
    display:flex;
    align-items:center;
    gap:8px;
    margin-bottom:4px;
}
.tp-ms-desc { font-size:13px; color:#64748b; line-height:1.6; margin:0 0 6px; }
.tp-ms-meta { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.tp-ms-date { font-size:11px; color:#475569; }
.tp-ms-status {
    padding:2px 10px;
    border-radius:999px;
    font-size:11px;
    font-weight:700;
}

/* Empty state */
.tp-empty {
    text-align:center;
    padding:64px 32px;
    background:rgba(15,23,42,0.6);
    border-radius:16px;
    border:1px solid rgba(255,255,255,0.06);
    color:#475569;
}
.tp-loading {
    text-align:center;
    padding:64px;
    color:#475569;
    font-size:14px;
}
.tp-spinner {
    width:32px; height:32px;
    border:3px solid rgba(255,255,255,0.07);
    border-top-color:#60a5fa;
    border-radius:50%;
    animation:tpspin .8s linear infinite;
    margin:0 auto 16px;
}
@keyframes tpspin { to{transform:rotate(360deg);} }

/* Milestone modal */
.tp-overlay {
    position:fixed; inset:0;
    background:rgba(5,10,24,0.8);
    backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:1000;
}
.tp-modal {
    background:#0f172a;
    border:1px solid rgba(255,255,255,0.1);
    border-radius:16px;
    width:90%; max-width:460px;
    padding:28px;
    box-shadow:0 24px 60px rgba(0,0,0,0.7);
}
.tp-inp {
    width:100%; padding:10px 13px;
    border:1px solid rgba(255,255,255,0.1);
    border-radius:9px; font-size:13px; outline:none;
    background:rgba(255,255,255,0.04); color:#e2e8f0;
    font-family:'Inter',sans-serif; box-sizing:border-box;
    transition:all .2s; color-scheme:dark;
}
.tp-inp::placeholder { color:#475569; }
.tp-inp:focus { border-color:rgba(96,165,250,0.4); background:rgba(96,165,250,0.06); box-shadow:0 0 0 3px rgba(96,165,250,0.1); }
.tp-inp option { background:#1e293b; }
.tp-lbl { display:block; margin-bottom:6px; font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.06em; }
.tp-btn-primary {
    display:inline-flex; align-items:center; gap:6px;
    padding:9px 20px;
    background:linear-gradient(135deg,#3b82f6,#6366f1);
    color:white; border:none; border-radius:9px;
    font-weight:700; font-size:13px; cursor:pointer;
    font-family:'Inter',sans-serif;
    box-shadow:0 4px 14px rgba(99,102,241,0.3);
    transition:all .2s;
}
.tp-btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,0.45); }
.tp-btn-ghost {
    display:inline-flex; align-items:center; gap:6px;
    padding:9px 18px;
    background:rgba(255,255,255,0.04); color:#94a3b8;
    border:1px solid rgba(255,255,255,0.1); border-radius:9px;
    font-weight:600; font-size:13px; cursor:pointer;
    font-family:'Inter',sans-serif; transition:all .2s;
}
.tp-btn-ghost:hover { background:rgba(255,255,255,0.08); color:#e2e8f0; }
`;

/* ─── Status Config ─────────────────────────────────────────────────────────── */
const MS_STATUS = {
    Completed:   { c:'#10b981', b:'rgba(16,185,129,0.12)',  bdr:'rgba(16,185,129,0.3)',  dot:'#10b981' },
    'In Progress':{ c:'#f59e0b', b:'rgba(245,158,11,0.12)', bdr:'rgba(245,158,11,0.3)',  dot:'#f59e0b' },
    Pending:     { c:'#64748b', b:'rgba(100,116,139,0.12)', bdr:'rgba(100,116,139,0.3)', dot:'#334155' },
};
const PROJ_STATUS = {
    Active:    { c:'#10b981', b:'rgba(16,185,129,0.12)',  bdr:'rgba(16,185,129,0.3)'  },
    Completed: { c:'#60a5fa', b:'rgba(96,165,250,0.12)',  bdr:'rgba(96,165,250,0.3)'  },
    Pending:   { c:'#f59e0b', b:'rgba(245,158,11,0.12)',  bdr:'rgba(245,158,11,0.3)'  },
    'On Hold': { c:'#94a3b8', b:'rgba(148,163,184,0.12)', bdr:'rgba(148,163,184,0.3)' },
};

const getMilestoneIcon = (status) => {
    if (status === 'Completed')   return <CheckCircle size={14} color="#10b981" />;
    if (status === 'In Progress') return <Activity   size={14} color="#f59e0b" />;
    return <Clock size={14} color="#475569" />;
};

const calcProgress = (progress = []) => {
    if (!progress.length) return 0;
    const done = progress.filter(m => m.status === 'Completed').length;
    return Math.round((done / progress.length) * 100);
};

/* ─── Component ─────────────────────────────────────────────────────────────── */
const TrackProject = () => {
    const [projects, setProjects]           = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);
    const [expandedId, setExpandedId]       = useState(null);
    const [modalOpen, setModalOpen]         = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [milestoneForm, setMilestoneForm] = useState({ title:'', description:'', status:'Pending' });

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const res = await axios.get(`${API_BASE_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    const openMilestoneModal = (project, e) => {
        e.stopPropagation();
        setSelectedProject(project);
        setMilestoneForm({ title:'', description:'', status:'Pending' });
        setModalOpen(true);
    };

    const handleMilestoneSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `${API_BASE_URL}/api/projects/${selectedProject._id}/progress`,

                milestoneForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setModalOpen(false);
            fetchProjects();
        } catch (err) {
            alert('Failed to add milestone.');
        }
    };

    const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

    return (
        <>
            <style>{css}</style>
            <div className="tp-root">

                {/* Header */}
                <div style={{ marginBottom:'28px' }}>
                    <h1 style={{ margin:0, fontSize:'24px', fontWeight:800, background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                        Track Active Projects
                    </h1>
                    <p style={{ margin:'5px 0 0', fontSize:'13px', color:'#64748b' }}>
                        Monitor milestones and progress for each project
                    </p>
                </div>

                {/* States */}
                {loading && (
                    <div className="tp-loading">
                        <div className="tp-spinner" />
                        Loading project data…
                    </div>
                )}
                {error && (
                    <div className="tp-empty">
                        <AlertCircle size={36} style={{ color:'#ef4444', margin:'0 auto 12px', display:'block' }} />
                        <p style={{ color:'#f87171', fontWeight:700, margin:0 }}>{error}</p>
                    </div>
                )}
                {!loading && !error && projects.length === 0 && (
                    <div className="tp-empty">
                        <Activity size={40} style={{ color:'#334155', margin:'0 auto 14px', display:'block' }} />
                        <p style={{ fontWeight:700, color:'#475569', margin:'0 0 6px' }}>No projects found</p>
                        <p style={{ fontSize:'13px', color:'#334155', margin:0 }}>Projects added from the Projects section will appear here.</p>
                    </div>
                )}

                {/* Project Cards */}
                {!loading && !error && projects.map(project => {
                    const isOpen   = expandedId === project._id;
                    const progress = calcProgress(project.progress);
                    const psc      = PROJ_STATUS[project.status] || PROJ_STATUS['Pending'];

                    return (
                        <div key={project._id} className="tp-card">
                            {/* Header Row */}
                            <div className="tp-card-header" onClick={() => toggle(project._id)}>
                                <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                                        <h3 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#f1f5f9' }}>{project.name}</h3>
                                        <span className="tp-status-badge" style={{ color:psc.c, background:psc.b, border:`1px solid ${psc.bdr}` }}>
                                            {project.status}
                                        </span>
                                        <span style={{ fontSize:'12px', color:'#475569' }}>
                                            {(project.progress||[]).filter(m=>m.status==='Completed').length}/{(project.progress||[]).length} milestones
                                        </span>
                                    </div>
                                    <p style={{ margin:'4px 0 0', fontSize:'12px', color:'#475569' }}>
                                        Client: {project.clientId || 'Unassigned'} {project.deadline ? `· Deadline: ${project.deadline}` : ''}
                                    </p>
                                    {/* Progress Bar */}
                                    <div className="tp-progress-track">
                                        <div className="tp-progress-fill" style={{ width:`${progress}%` }} />
                                    </div>
                                </div>
                                <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
                                    <span style={{ fontSize:'13px', fontWeight:700, color: progress===100 ? '#10b981' : '#60a5fa' }}>{progress}%</span>
                                    {isOpen
                                        ? <ChevronUp  size={18} color="#64748b" />
                                        : <ChevronDown size={18} color="#64748b" />}
                                </div>
                            </div>

                            {/* Expanded Body */}
                            {isOpen && (
                                <div className="tp-expanded-body">
                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0 14px' }}>
                                        <h4 style={{ margin:0, fontSize:'14px', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.06em' }}>
                                            Timeline &amp; Milestones
                                        </h4>
                                        <button className="tp-btn-primary" style={{ padding:'7px 16px', fontSize:'12px' }}
                                            onClick={e => openMilestoneModal(project, e)}>
                                            <Plus size={14} /> Add Milestone
                                        </button>
                                    </div>

                                    {(!project.progress || project.progress.length === 0) ? (
                                        <p style={{ fontSize:'13px', color:'#475569', fontStyle:'italic', padding:'8px 0 0' }}>
                                            No milestones recorded yet. Add one to start tracking progress.
                                        </p>
                                    ) : (
                                        <div className="tp-timeline">
                                            {project.progress.map((ms, idx) => {
                                                const sc = MS_STATUS[ms.status] || MS_STATUS['Pending'];
                                                return (
                                                    <div key={idx} className="tp-timeline-item">
                                                        <div className="tp-timeline-dot" style={{ background:sc.dot, boxShadow:`0 0 8px ${sc.dot}66` }} />
                                                        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'12px 14px' }}>
                                                            <p className="tp-ms-title">
                                                                {getMilestoneIcon(ms.status)}
                                                                {ms.title}
                                                            </p>
                                                            <p className="tp-ms-desc">{ms.description}</p>
                                                            <div className="tp-ms-meta">
                                                                {ms.date && (
                                                                    <span className="tp-ms-date">
                                                                        📅 {new Date(ms.date).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                                <span className="tp-ms-status" style={{ color:sc.c, background:sc.b, border:`1px solid ${sc.bdr}` }}>
                                                                    {ms.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add Milestone Modal */}
                {modalOpen && (
                    <div className="tp-overlay" onClick={() => setModalOpen(false)}>
                        <div className="tp-modal" onClick={e => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'22px' }}>
                                <div>
                                    <h3 style={{ margin:0, fontSize:'17px', fontWeight:700, background:'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                                        Add Milestone
                                    </h3>
                                    <p style={{ margin:'3px 0 0', fontSize:'12px', color:'#475569' }}>{selectedProject?.name}</p>
                                </div>
                                <button onClick={() => setModalOpen(false)} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', fontSize:'16px' }}>✕</button>
                            </div>

                            <form onSubmit={handleMilestoneSubmit}>
                                <div style={{ marginBottom:14 }}>
                                    <label className="tp-lbl">Title *</label>
                                    <input type="text" required placeholder="e.g. Foundation Completed"
                                        className="tp-inp"
                                        value={milestoneForm.title}
                                        onChange={e => setMilestoneForm({ ...milestoneForm, title:e.target.value })} />
                                </div>
                                <div style={{ marginBottom:14 }}>
                                    <label className="tp-lbl">Description *</label>
                                    <textarea required rows={4} placeholder="Describe what was accomplished…"
                                        className="tp-inp" style={{ resize:'vertical' }}
                                        value={milestoneForm.description}
                                        onChange={e => setMilestoneForm({ ...milestoneForm, description:e.target.value })} />
                                </div>
                                <div style={{ marginBottom:22 }}>
                                    <label className="tp-lbl">Status</label>
                                    <select className="tp-inp"
                                        value={milestoneForm.status}
                                        onChange={e => setMilestoneForm({ ...milestoneForm, status:e.target.value })}>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                {/* Preview dot */}
                                <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 13px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'9px', marginBottom:20 }}>
                                    <div style={{ width:10, height:10, borderRadius:'50%', background: MS_STATUS[milestoneForm.status]?.dot || '#334155', boxShadow:`0 0 8px ${MS_STATUS[milestoneForm.status]?.dot || '#334155'}99`, flexShrink:0 }} />
                                    <span style={{ fontSize:'12px', color:'#64748b' }}>Status preview — </span>
                                    <span style={{ fontSize:'12px', fontWeight:700, color: MS_STATUS[milestoneForm.status]?.c || '#64748b' }}>{milestoneForm.status}</span>
                                </div>
                                <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                                    <button type="button" className="tp-btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="tp-btn-primary">Save Milestone</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TrackProject;
