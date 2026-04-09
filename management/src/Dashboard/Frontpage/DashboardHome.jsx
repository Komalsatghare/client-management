import React, { useState, useEffect, useRef } from 'react';
import {
  Users, DollarSign, Activity, ShoppingBag,
  TrendingUp, TrendingDown, ArrowRight, Bell,
  Calendar, Clock, Zap, CheckCircle, AlertCircle,
  BarChart2, RefreshCw, ChevronRight, Mail
} from 'lucide-react';
import axios from 'axios';
import './DashboardHome.css';

/* ── animated counter hook ───────────────────────────── */
const useCounter = (target, duration = 1400) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

/* ── single stat card ────────────────────────────────── */
const StatCard = ({ title, value, rawValue, icon, gradient, trend, trendUp, suffix = '', prefix = '', onClick, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const animatedVal = useCounter(visible ? rawValue : 0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const displayValue = prefix + (rawValue > 999 ? animatedVal.toLocaleString() : animatedVal) + suffix;

  return (
    <div
      className={`dhome-stat-card ${visible ? 'dhome-stat-card--visible' : ''}`}
      style={{ '--grad': gradient, animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="dhome-stat-card__glow" />
      <div className="dhome-stat-card__top">
        <div className="dhome-stat-icon">{icon}</div>
        <div className={`dhome-stat-trend ${trendUp ? 'up' : 'down'}`}>
          {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{trend}</span>
        </div>
      </div>
      <div className="dhome-stat-card__body">
        <dd className="dhome-stat-value">{displayValue}</dd>
        <dt className="dhome-stat-label">{title}</dt>
      </div>
      <div className="dhome-stat-card__bar">
        <div className="dhome-stat-card__bar-fill" style={{ width: visible ? '70%' : '0%' }} />
      </div>
      {onClick && (
        <button className="dhome-stat-cta">
          View Details <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

/* ── quick action button ─────────────────────────────── */
const QuickAction = ({ icon, label, color, onClick }) => (
  <button className="dhome-quick-action" style={{ '--qa-color': color }} onClick={onClick}>
    <span className="dhome-quick-action__icon">{icon}</span>
    <span className="dhome-quick-action__label">{label}</span>
  </button>
);

/* ── activity item ───────────────────────────────────── */
const ActivityItem = ({ icon, title, sub, time, type }) => (
  <div className={`dhome-activity-item dhome-activity-item--${type}`}>
    <div className="dhome-activity-dot">{icon}</div>
    <div className="dhome-activity-info">
      <p className="dhome-activity-title">{title}</p>
      <p className="dhome-activity-sub">{sub}</p>
    </div>
    <span className="dhome-activity-time">{time}</span>
  </div>
);

/* ── main component ──────────────────────────────────── */
const DashboardHome = ({ onStatClick }) => {
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [clientCount, setClientCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [pendingPaymentsAmount, setPendingPaymentsAmount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [inProgressProjects, setInProgressProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [perfStats, setPerfStats] = useState({ 
    projects: 0, payments: 0, satisfaction: 0, inquiries: 0 
  });
  const [refreshing, setRefreshing] = useState(false);

  const computeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const tick = () => {
    const now = new Date();
    setGreeting(computeGreeting());
    setDateStr(now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    setTimeStr(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('authToken');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const [clientsRes, projectsRes, inquiriesRes, paymentsRes, requestsRes, feedbackRes] = await Promise.all([
        axios.get('http://localhost:5000/api/clients', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/projects', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/inquiries', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/payments', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/project-requests', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/feedback', config).catch(() => ({ data: [] })),
      ]);

      const clients = clientsRes.data || [];
      const projects = projectsRes.data || [];
      const inquiries = inquiriesRes.data || [];
      const payments = paymentsRes.data || [];
      const requests = requestsRes.data || [];
      const feedback = feedbackRes.data || [];

      setClientCount(clients.length);
      setProjectCount(projects.filter(p => p.status === 'Active').length);
      setPendingCount(projects.filter(p => p.status === 'Pending').length);
      
      const pendingInqs = inquiries.filter(i => i.status === 'New' || i.status === 'pending');
      setInquiryCount(pendingInqs.length);
      
      const totalPending = payments
        .filter(p => p.paymentStatus === 'pending')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      setPendingPaymentsAmount(totalPending);

      const pendingReqs = requests.filter(r => r.status === 'pending');
      setPendingRequestsCount(pendingReqs.length);

      const ongoing = projects
        .filter(p => p.status === 'Active' || p.status === 'In Progress')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3);
      setInProgressProjects(ongoing);

      // ── Calculate Performance Percentages ──
      const calcProjects = projects.length > 0 ? (projects.filter(p => p.status === 'Completed').length / projects.length) * 100 : 0;
      const calcPayments = payments.length > 0 ? (payments.filter(p => p.paymentStatus === 'completed').length / payments.length) * 100 : 0;
      const calcInquiries = inquiries.length > 0 ? (inquiries.filter(i => i.status === 'Resolved').length / inquiries.length) * 100 : 0;
      const calcSat = feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / (feedback.length * 5)) * 100 : 100;

      setPerfStats({
        projects: Math.round(calcProjects),
        payments: Math.round(calcPayments),
        inquiries: Math.round(calcInquiries),
        satisfaction: Math.round(calcSat)
      });

      // ── Aggregate Notifications ──
      const newNotes = [];
      
      // Inquiries
      pendingInqs.slice(0, 5).forEach(i => {
        newNotes.push({
          id: `inq-${i._id}`,
          title: `New Inquiry`,
          sub: `${i.firstName} ${i.lastName} - ${i.service}`,
          icon: <Mail size={14} />,
          type: 'neutral'
        });
      });

      // Project Requests
      pendingReqs.slice(0, 5).forEach(r => {
        const client = clients.find(c => c._id.toString() === r.clientId?.toString());
        newNotes.push({
          id: `req-${r._id}`,
          title: `Project Request`,
          sub: `From ${client ? client.name : 'Unknown Client'}: ${r.title}`,
          icon: <Activity size={14} />,
          type: 'info'
        });
      });

      // Zoom Meetings (Upcoming or Requested)
      requests.filter(r => r.zoomJoinUrl || r.status === 'meeting_requested').slice(0, 5).forEach(r => {
        const client = clients.find(c => c._id.toString() === r.clientId?.toString());
        const isRequested = r.status === 'meeting_requested';
        newNotes.push({
          id: `zoom-${r._id}`,
          title: isRequested ? `Meeting Requested` : `Zoom Meeting`,
          sub: isRequested 
            ? `Client ${client ? client.name : 'Unknown'} requested a meeting`
            : `Scheduled with ${client ? client.name : 'Unknown Client'}`,
          icon: <Zap size={14} />,
          type: isRequested ? 'warning' : 'success'
        });
      });

      setNotifications(newNotes.slice(0, 8));

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  useEffect(() => {
    tick();
    fetchData();
    const clockTimer = setInterval(tick, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const recentActivities = [
    { icon: <Bell size={14} />, title: 'Upcoming pending inquiries', sub: `${inquiryCount} inquiries awaiting response`, time: 'Real-time', type: 'neutral' },
    { icon: <AlertCircle size={14} />, title: 'Payment pending', sub: `Actual pending amount: ₹${pendingPaymentsAmount.toLocaleString()}`, time: 'Live', type: 'warning' },
    { icon: <Activity size={14} />, title: 'Project Requests', sub: `${pendingRequestsCount} new project requests pending`, time: 'Update', type: 'info' },
  ];

  return (
    <div className="dhome">
      {/* ── Header ── */}
      <div className="dhome-header">
        <div className="dhome-header__left">
          <h1 className="dhome-greeting">{greeting}, <span>Admin</span> 👋</h1>
          <p className="dhome-date">
            <Calendar size={14} /> {dateStr}
          </p>
        </div>
        <div className="dhome-header__right">
          <div className="dhome-clock">
            <Clock size={16} />
            <span>{timeStr}</span>
          </div>
          <button
            className={`dhome-refresh-btn ${refreshing ? 'spinning' : ''}`}
            onClick={fetchData}
            title="Refresh data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dhome-stats">
        <StatCard
          title="Total Clients"
          rawValue={clientCount || 1245}
          prefix=""
          suffix=""
          icon={<Users size={22} />}
          gradient="linear-gradient(135deg,#3b82f6,#6366f1)"
          trend="+12%"
          trendUp={true}
          delay={0}
          onClick={() => onStatClick && onStatClick('Client Records')}
        />
        <StatCard
          title="Revenue"
          rawValue={45231}
          prefix="₹"
          suffix=""
          icon={<DollarSign size={22} />}
          gradient="linear-gradient(135deg,#10b981,#14b8a6)"
          trend="+8.2%"
          trendUp={true}
          delay={100}
          onClick={() => onStatClick && onStatClick('Payments')}
        />
        <StatCard
          title="Active Projects"
          rawValue={projectCount || 12}
          prefix=""
          suffix=""
          icon={<Activity size={22} />}
          gradient="linear-gradient(135deg,#8b5cf6,#ec4899)"
          trend="+3"
          trendUp={true}
          delay={200}
          onClick={() => onStatClick && onStatClick('Projects', 'Active')}
        />
        <StatCard
          title="Pending Orders"
          rawValue={pendingCount || 7}
          prefix=""
          suffix=""
          icon={<ShoppingBag size={22} />}
          gradient="linear-gradient(135deg,#f59e0b,#ef4444)"
          trend="-2"
          trendUp={false}
          delay={300}
          onClick={() => onStatClick && onStatClick('Orders')}
        />
      </div>

      {/* ── Quick Actions + Activity ── */}
      <div className="dhome-lower">
        {/* Quick Actions */}
        <div className="dhome-panel dhome-panel--actions">
          <div className="dhome-panel__header">
            <Zap size={18} />
            <h3>Quick Actions</h3>
          </div>
          <div className="dhome-quick-actions-grid">
            <QuickAction icon={<Users size={20} />} label="Add Client" color="#3b82f6" onClick={() => onStatClick && onStatClick('Client Records')} />
            <QuickAction icon={<BarChart2 size={20} />} label="New Project" color="#8b5cf6" onClick={() => onStatClick && onStatClick('Projects')} />
            <QuickAction icon={<DollarSign size={20} />} label="Payments" color="#10b981" onClick={() => onStatClick && onStatClick('Payments')} />
            <QuickAction icon={<Bell size={20} />} label="Inquiries" color="#f59e0b" onClick={() => onStatClick && onStatClick('Inquiries')} />
            <QuickAction icon={<Activity size={20} />} label="Track Project" color="#ec4899" onClick={() => onStatClick && onStatClick('Track Project')} />
            <QuickAction icon={<ShoppingBag size={20} />} label="Project Requests" color="#14b8a6" onClick={() => onStatClick && onStatClick('Project Requests')} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dhome-panel dhome-panel--activity">
          <div className="dhome-panel__header">
            <Activity size={18} />
            <h3>Recent Activity</h3>
          </div>
          <div className="dhome-activity-list">
            {recentActivities.map((item, i) => (
              <ActivityItem key={i} {...item} />
            ))}
          </div>
        </div>

        {/* My Recent Projects */}
        <div className="dhome-panel dhome-panel--projects">
          <div className="dhome-panel__header">
            <RefreshCw size={18} />
            <h3>My Recent Project</h3>
          </div>
          <div className="dhome-activity-list">
            {inProgressProjects.length > 0 ? (
              inProgressProjects.map((project, i) => (
                <div key={i} className="dhome-activity-item dhome-activity-item--info" style={{ cursor: 'pointer' }} onClick={() => onStatClick && onStatClick('Projects')}>
                  <div className="dhome-activity-dot"><Zap size={14} /></div>
                  <div className="dhome-activity-info">
                    <p className="dhome-activity-title">{project.name}</p>
                    <p className="dhome-activity-sub">Status: {project.status}</p>
                  </div>
                  <span className="dhome-activity-time">Ongoing</span>
                </div>
              ))
            ) : (
              <p style={{ padding: '20px', color: '#64748b', fontSize: '13px', textAlign: 'center' }}>No ongoing projects found.</p>
            )}
          </div>
        </div>

        {/* Dynamic Notifications */}
        <div className="dhome-panel dhome-panel--notifications">
          <div className="dhome-panel__header">
            <Bell size={18} />
            <h3>Notifications</h3>
          </div>
          <div className="dhome-activity-list">
            {notifications.length > 0 ? (
              notifications.map((note) => (
                <div key={note.id} className={`dhome-activity-item dhome-activity-item--${note.type}`}>
                  <div className="dhome-activity-dot">{note.icon}</div>
                  <div className="dhome-activity-info">
                    <p className="dhome-activity-title">{note.title}</p>
                    <p className="dhome-activity-sub">{note.sub}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ padding: '20px', color: '#64748b', fontSize: '13px', textAlign: 'center' }}>No new notifications.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Performance Strip ── */}
      <div className="dhome-perf-strip">
        {[
          { label: 'Projects on track', val: perfStats.projects, color: '#10b981' },
          { label: 'Payments collected', val: perfStats.payments, color: '#3b82f6' },
          { label: 'Client satisfaction', val: perfStats.satisfaction, color: '#8b5cf6' },
          { label: 'Inquiries resolved', val: perfStats.inquiries, color: '#f59e0b' },
        ].map((item, i) => (
          <div key={i} className="dhome-perf-item">
            <div className="dhome-perf-top">
              <span className="dhome-perf-label">{item.label}</span>
              <span className="dhome-perf-val" style={{ color: item.color }}>{item.val}%</span>
            </div>
            <div className="dhome-perf-bar-track">
              <div className="dhome-perf-bar-fill" style={{ '--fill-w': `${item.val}%`, '--fill-color': item.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
