import React, { useState, useEffect } from "react";
import { Users, DollarSign, Activity, Mail, FolderKanban, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { API_BASE_URL } from "../../config";
import '../dashboard.css';

const StatCard = ({ title, value, icon, colorClass, trend, onClick }) => (
  <div
    className="stat-card"
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div className="stat-content">
      <div className={`stat-icon-wrapper ${colorClass}`}>
        {icon}
      </div>
      <div className="stat-info">
        <dt className="stat-label">{title}</dt>
        <dd className="stat-value">{value}</dd>
        {trend && <span className="stat-trend">↑ {trend}</span>}
      </div>
    </div>
  </div>
);

const DashboardHome = ({ onStatClick }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ clients: '—', payments: '—', projects: '—', inquiries: '—', activeProjects: '—', requests: '—' });

  useEffect(() => {
    // Fetch real counts from backend
    const fetchStats = async () => {
      try {
        const [clientsRes, projectsRes, inquiriesRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/clients`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/projects`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inquiries`).then(r => r.json()),
        ]);

        const clients  = clientsRes.status  === 'fulfilled' ? clientsRes.value  : [];
        const projects = projectsRes.status === 'fulfilled' ? projectsRes.value : [];
        const inqs     = inquiriesRes.status === 'fulfilled' ? inquiriesRes.value : [];

        setStats({
          clients: Array.isArray(clients) ? clients.length : '—',
          projects: Array.isArray(projects) ? projects.length : '—',
          activeProjects: Array.isArray(projects) ? projects.filter(p => p.status === 'Active').length : '—',
          inquiries: Array.isArray(inqs) ? inqs.length : '—',
          payments: '—',
          requests: '—',
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    { label: t('view_clients') || 'View Clients',   icon: '👥', section: 'Client Records' },
    { label: t('all_projects_action') || 'All Projects',   icon: '🏗️', section: 'Projects' },
    { label: t('new_inquiries') || 'New Inquiries',  icon: '📬', section: 'Inquiries' },
    { label: t('payments_action') || 'Payments',       icon: '💳', section: 'Payments' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('dashboard_overview') || "Dashboard Overview"}</h1>
          <p className="page-subtitle">{t('welcome_admin_msg') || "Welcome back, Admin. Here's what's happening today."}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title={t('total_clients') || "Total Clients"}
          value={stats.clients}
          icon={<Users size={22} color="#fff" />}
          colorClass="bg-blue"
          trend={t('growing') || "Growing"}
          onClick={() => onStatClick && onStatClick('Client Records')}
        />
        <StatCard
          title={t('total_projects') || "Total Projects"}
          value={stats.projects}
          icon={<FolderKanban size={22} color="#fff" />}
          colorClass="bg-indigo"
          onClick={() => onStatClick && onStatClick('Projects')}
        />
        <StatCard
          title={t('active_projects_stat') || "Active Projects"}
          value={stats.activeProjects}
          icon={<Activity size={22} color="#fff" />}
          colorClass="bg-green"
          trend={t('in_progress') || "In Progress"}
          onClick={() => onStatClick && onStatClick('Projects', 'Active')}
        />
        <StatCard
          title={t('open_inquiries') || "Open Inquiries"}
          value={stats.inquiries}
          icon={<Mail size={22} color="#fff" />}
          colorClass="bg-yellow"
          onClick={() => onStatClick && onStatClick('Inquiries')}
        />
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-card-header">
          <span className="section-card-title">⚡ {t('quick_actions') || "Quick Actions"}</span>
        </div>
        <div className="section-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {quickActions.map((action) => (
              <button
                key={action.section}
                onClick={() => onStatClick && onStatClick(action.section)}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '18px 14px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  transition: 'all 0.2s', fontFamily: 'inherit',
                  color: '#94a3b8',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(214,43,27,0.35)';
                  e.currentTarget.style.background   = 'rgba(214,43,27,0.06)';
                  e.currentTarget.style.color         = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background   = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color         = '#94a3b8';
                }}
              >
                <span style={{ fontSize: 26 }}>{action.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, textAlign: 'center' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="section-card">
        <div className="section-card-header">
          <span className="section-card-title">📊 {t('business_summary') || "Business Summary"}</span>
        </div>
        <div className="section-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { label: t('completed_projects') || 'Completed Projects', value: '—', icon: '✅', color: '#34d399' },
              { label: t('pending_requests') || 'Pending Requests',   value: '—', icon: '⏳', color: '#fbbf24' },
              { label: t('total_revenue') || 'Total Revenue',      value: '—', icon: '💰', color: '#60a5fa' },
            ].map((item) => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14
              }}>
                <span style={{ fontSize: 28 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: item.color }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
