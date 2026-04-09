import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    id: "building",
    icon: "🏗️",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    glow: "rgba(239,68,68,0.3)",
    tag: "Most Popular",
    tagColor: "#ef4444",
    title: "Building Construction",
    short: "End-to-end modern, durable, and functional structural development.",
    desc: "We handle complete building construction from foundation to finishing — residential bungalows, multi-storey apartments, commercial complexes, and industrial buildings. Our engineers enforce the highest quality at every phase.",
    features: ["RCC Framed Structures", "Foundation Design", "Structural Analysis", "Site Supervision", "Quality Inspection", "Project Documentation"],
  },
  {
    id: "interior",
    icon: "🛋️",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    glow: "rgba(139,92,246,0.3)",
    tag: "Premium",
    tagColor: "#8b5cf6",
    title: "Interior Design",
    short: "Transforming spaces with vision, precision, and lasting elegance.",
    desc: "Our interior design team blends aesthetics with functionality, creating spaces that reflect your personality and serve your lifestyle. From modular kitchens to false ceilings, we handle every detail with artistry.",
    features: ["Modular Kitchen & Wardrobes", "False Ceiling & Lighting", "Flooring & Wall Textures", "Bathroom Design", "Living Room Styling", "3D Interior Visualization"],
  },
  {
    id: "land",
    icon: "🌍",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    glow: "rgba(16,185,129,0.3)",
    tag: "Infrastructure",
    tagColor: "#10b981",
    title: "Land Development",
    short: "Comprehensive site preparation, planning, and infrastructure setup.",
    desc: "From raw land to ready-to-build plots, we handle surveying, leveling, soil testing, drainage layouts, road formation, and utility trenching. We transform undeveloped land into fully serviced construction-ready parcels.",
    features: ["Topographic Survey & Mapping", "Soil Testing & Analysis", "Earthwork & Leveling", "Drainage Network Design", "Road Formation", "Plot Development Planning"],
  },
  {
    id: "design",
    icon: "📐",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    glow: "rgba(59,130,246,0.3)",
    tag: "Architectural",
    tagColor: "#3b82f6",
    title: "2D / 3D Design & Planning",
    short: "Precise architectural modeling and pre-construction visualization.",
    desc: "Before a single brick is laid, our design team builds your structure virtually. We create detailed 2D floor plans and photorealistic 3D renderings using software like AutoCAD, Revit, and SketchUp — so you see exactly what you'll get.",
    features: ["AutoCAD Floor Plans", "3D Architectural Rendering", "Structural Drawings", "MEP Coordination Drawings", "BOQ Estimation", "Permit-Ready Drawings"],
  },
  {
    id: "renovation",
    icon: "🔨",
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    glow: "rgba(249,115,22,0.3)",
    tag: "Renovation",
    tagColor: "#f97316",
    title: "Structural Renovation",
    short: "Safe, certified retrofitting and structural strengthening work.",
    desc: "We assess, repair, and upgrade existing structures — old buildings, damaged slabs, corroded steel, failing foundations. Our structural renovation specialists apply modern techniques to extend your building's life safely and economically.",
    features: ["Structural Audit & Assessment", "Jacketing & Retrofitting", "Crack Repair & Waterproofing", "Slab Repair & Strengthening", "Column Jacketing", "Post-Earthquake Repair"],
  },
  {
    id: "electrical",
    icon: "⚡",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    glow: "rgba(245,158,11,0.3)",
    tag: "MEP Services",
    tagColor: "#f59e0b",
    title: "Electrical & MEP Work",
    short: "Full electrical, plumbing, and HVAC services for any project scale.",
    desc: "Our MEP (Mechanical, Electrical, Plumbing) division handles complete internal services — from load calculations and panel design to sanitary piping and HVAC ducting. Every installation is code-compliant and safety-inspected.",
    features: ["Electrical Panel Design", "Internal Wiring & Conduits", "Plumbing & Sanitation", "Water Supply Lines", "HVAC Ducting", "Fire Fighting Systems"],
  },
  {
    id: "project",
    icon: "📊",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    glow: "rgba(6,182,212,0.3)",
    tag: "Management",
    tagColor: "#06b6d4",
    title: "Project Management",
    short: "End-to-end project oversight, timeline management, and cost control.",
    desc: "We act as your Owner's Representative — managing contractors, monitoring milestones, controlling budgets, and providing weekly progress reports. Our PMs ensure your project finishes on time, on budget, and to spec.",
    features: ["Site Progress Monitoring", "Contractor Coordination", "Budget Tracking & Control", "Weekly Progress Reports", "Risk Management", "Procurement Oversight"],
  },
  {
    id: "consulting",
    icon: "🎓",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
    glow: "rgba(236,72,153,0.3)",
    tag: "Advisory",
    tagColor: "#ec4899",
    title: "Civil Engineering Consultancy",
    short: "Expert structural advice, peer reviews, and compliance guidance.",
    desc: "Need a second opinion? Our senior engineers provide independent structural review, load analysis, code compliance checks, and expert testimony. We serve developers, architects, and legal teams across Maharashtra.",
    features: ["Structural Peer Review", "Stability Certificates", "Load Analysis Reports", "Code Compliance Audit", "Expert Witness Reports", "Feasibility Studies"],
  },
];

const process = [
  { step: "01", title: "Free Consultation", desc: "Discuss your requirements with our senior engineer — no cost, no obligation.", icon: "💬" },
  { step: "02", title: "Site Visit & Assessment", desc: "Our team visits the site, evaluates conditions, and takes measurements.", icon: "🔍" },
  { step: "03", title: "Design & Estimation", desc: "We prepare detailed drawings with a transparent cost breakdown.", icon: "📋" },
  { step: "04", title: "Agreement & Kickoff", desc: "Sign the contract and we mobilise the team within 48 hours.", icon: "🤝" },
  { step: "05", title: "Construction & Monitoring", desc: "Quality-controlled execution with regular updates and site inspections.", icon: "🏗️" },
  { step: "06", title: "Delivery & Handover", desc: "Final walkthrough, punch-list resolution, and complete documentation handover.", icon: "🎉" },
];

function ServiceCard({ svc, index }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className={`svc-card${hovered ? " hovered" : ""}${expanded ? " expanded" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Glow overlay — very subtle tint only, not a solid fill */}
      <div className="svc-card-glow" style={{ opacity: hovered ? 0.07 : 0, background: svc.gradient }} />

      {/* Top accent line */}
      <div className="svc-card-line" style={{ background: svc.gradient, opacity: hovered ? 1 : 0 }} />

      {/* Tag */}
      <span className="svc-tag" style={{ background: svc.tagColor + "22", color: svc.tagColor, borderColor: svc.tagColor + "44" }}>
        {svc.tag}
      </span>

      {/* Icon */}
      <div className="svc-icon-wrap" style={{ background: svc.gradient, boxShadow: hovered ? `0 12px 32px ${svc.glow}` : "none" }}>
        {svc.icon}
      </div>

      <h3 className="svc-card-title">{svc.title}</h3>
      <p className="svc-card-short">{svc.short}</p>

      {/* Expandable section */}
      {expanded && (
        <div className="svc-expanded">
          <p className="svc-card-desc">{svc.desc}</p>
          <div className="svc-features">
            {svc.features.map((f) => (
              <span key={f} className="svc-feature">
                <span style={{ color: svc.tagColor }}>✓</span> {f}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="svc-card-footer">
        <button
          className="svc-toggle-btn"
          style={{ color: svc.tagColor, borderColor: svc.tagColor + "44" }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less ↑" : "Learn More ↓"}
        </button>
        <button
          className="svc-cta-btn"
          style={{ background: svc.gradient, boxShadow: hovered ? `0 6px 20px ${svc.glow}` : "none" }}
          onClick={() => {
            if (window.location.pathname === "/") {
              document.getElementById("enquiry-section")?.scrollIntoView({ behavior: "smooth" });
            } else {
              navigate("/#enquiry-section");
            }
          }}
        >
          Get Quote
        </button>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [filter, setFilter] = useState("All");
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.05 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const categories = ["All", "Construction", "Design", "MEP Services", "Management"];
  const catMap = {
    "Construction": ["building", "renovation", "land"],
    "Design": ["interior", "design"],
    "MEP Services": ["electrical"],
    "Management": ["project", "consulting"],
  };

  const visible = filter === "All" ? services : services.filter(s => catMap[filter]?.includes(s.id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        /* ──────────── HERO ──────────── */
        .svc-hero {
          background: linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%);
          padding: 100px 24px 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        .svc-hero-orb {
          position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; opacity: 0.15;
        }
        .svc-hero-orb-1 { width: 500px; height: 500px; background: #d62b1b; top: -150px; right: -80px; }
        .svc-hero-orb-2 { width: 400px; height: 400px; background: #7c3aed; bottom: -120px; left: -80px; }
        .svc-hero-inner { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
        .svc-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(214,43,27,0.12); border: 1px solid rgba(214,43,27,0.35);
          padding: 7px 20px; border-radius: 50px; margin-bottom: 24px;
        }
        .svc-hero-eyebrow span { color: #d62b1b; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .svc-hero-title {
          font-size: clamp(36px, 6vw, 68px); font-weight: 900;
          color: #fff; line-height: 1.1; margin: 0 0 20px; letter-spacing: -1px;
        }
        .svc-hero-title .red { color: #d62b1b; }
        .svc-hero-desc { font-size: 18px; color: #64748b; line-height: 1.75; margin: 0 0 40px; }
        .svc-hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .svc-hero-btn-primary {
          padding: 14px 32px; background: #d62b1b; border: none; border-radius: 12px;
          color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;
          box-shadow: 0 8px 28px rgba(214,43,27,0.4); transition: all 0.25s;
          font-family: inherit;
        }
        .svc-hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(214,43,27,0.5); }
        .svc-hero-btn-secondary {
          padding: 14px 32px; background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px;
          color: #fff; font-size: 15px; font-weight: 600; cursor: pointer;
          transition: all 0.25s; font-family: inherit;
        }
        .svc-hero-btn-secondary:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }
        .svc-hero-stats {
          display: flex; gap: 48px; justify-content: center; margin-top: 60px; flex-wrap: wrap;
          padding-top: 48px; border-top: 1px solid rgba(255,255,255,0.08);
        }
        .svc-hero-stat-num { font-size: 36px; font-weight: 900; color: #fff; line-height: 1; }
        .svc-hero-stat-label { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }

        /* ──────────── MAIN SECTION ──────────── */
        .svc-section {
          padding: 80px 24px 100px;
          background: #0f172a;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          position: relative;
        }
        .svc-section::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .svc-inner { max-width: 1240px; margin: 0 auto; position: relative; z-index: 1; }

        /* Filter Tabs */
        .svc-filters {
          display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
          margin-bottom: 52px;
        }
        .svc-filter-btn {
          padding: 9px 22px; border-radius: 50px; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04); color: #94a3b8; font-family: inherit;
        }
        .svc-filter-btn:hover { border-color: rgba(255,255,255,0.25); color: #fff; }
        .svc-filter-btn.active {
          background: #d62b1b; border-color: #d62b1b; color: #fff;
          box-shadow: 0 4px 16px rgba(214,43,27,0.4);
        }

        /* Cards Grid */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          margin-bottom: 80px;
        }

        /* Card */
        .svc-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px 24px 24px;
          position: relative; overflow: hidden;
          cursor: default;
          display: flex; flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.34,1.36,0.64,1),
                      box-shadow 0.35s, border-color 0.35s;
          animation: svcFadeUp 0.5s ease both;
        }
        @keyframes svcFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .svc-card.hovered {
          transform: translateY(-8px);
          box-shadow: 0 24px 56px rgba(0,0,0,0.45);
          border-color: rgba(255,255,255,0.15);
        }
        .svc-card-glow {
          position: absolute; inset: 0; pointer-events: none; border-radius: 20px;
          opacity: 0; transition: opacity 0.35s;
          background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent);
        }
        .svc-card-line {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          border-radius: 20px 20px 0 0; transition: opacity 0.3s;
        }

        .svc-tag {
          display: inline-block; padding: 4px 10px; border-radius: 20px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;
          border: 1px solid; margin-bottom: 16px; align-self: flex-start;
        }
        .svc-icon-wrap {
          width: 56px; height: 56px; border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin-bottom: 18px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .svc-card.hovered .svc-icon-wrap { transform: scale(1.1) rotate(-5deg); }
        .svc-card-title { font-size: 17px; font-weight: 800; color: #f1f5f9; margin: 0 0 8px; }
        .svc-card-short { font-size: 13px; color: #64748b; line-height: 1.65; margin: 0; flex: 1; }

        /* Expanded */
        .svc-expanded { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.07); }
        .svc-card-desc { font-size: 13px; color: #94a3b8; line-height: 1.7; margin: 0 0 14px; }
        .svc-features { display: flex; flex-wrap: wrap; gap: 8px; }
        .svc-feature {
          font-size: 11px; color: #cbd5e1; font-weight: 500;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          padding: 4px 10px; border-radius: 6px;
          display: flex; align-items: center; gap: 5px;
        }

        /* Footer buttons */
        .svc-card-footer { display: flex; gap: 10px; margin-top: 20px; align-items: center; }
        .svc-toggle-btn {
          flex: 1; padding: 9px; background: transparent; border: 1px solid;
          border-radius: 9px; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: inherit;
        }
        .svc-toggle-btn:hover { background: rgba(255,255,255,0.05); }
        .svc-cta-btn {
          padding: 9px 16px; border: none; border-radius: 9px;
          color: #fff; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: inherit; white-space: nowrap;
        }
        .svc-cta-btn:hover { transform: translateY(-1px); }

        /* ──────────── PROCESS ──────────── */
        .svc-process { margin-bottom: 80px; }
        .svc-process-header { text-align: center; margin-bottom: 52px; }
        .svc-section-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(214,43,27,0.1); border: 1px solid rgba(214,43,27,0.3);
          padding: 6px 18px; border-radius: 50px; margin-bottom: 16px;
          font-size: 11px; color: #d62b1b; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
        }
        .svc-section-title { font-size: clamp(24px, 3vw, 38px); font-weight: 800; color: #fff; margin: 0 0 12px; }
        .svc-section-sub { font-size: 15px; color: #64748b; max-width: 500px; margin: 0 auto; line-height: 1.7; }

        .svc-process-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        .svc-process-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 28px 24px;
          position: relative; transition: border-color 0.3s, background 0.3s;
        }
        .svc-process-card:hover { border-color: rgba(214,43,27,0.35); background: rgba(214,43,27,0.04); }
        .svc-process-num {
          position: absolute; top: 20px; right: 20px;
          font-size: 40px; font-weight: 900; color: rgba(255,255,255,0.04);
          line-height: 1; font-family: 'Inter', monospace;
        }
        .svc-process-icon { font-size: 28px; margin-bottom: 14px; display: block; }
        .svc-process-title { font-size: 15px; font-weight: 700; color: #f1f5f9; margin: 0 0 8px; }
        .svc-process-desc { font-size: 13px; color: #64748b; line-height: 1.65; margin: 0; }

        /* ──────────── CTA ──────────── */
        .svc-cta-section {
          background: linear-gradient(135deg, rgba(214,43,27,0.15), rgba(214,43,27,0.05));
          border: 1px solid rgba(214,43,27,0.25); border-radius: 24px;
          padding: 56px 48px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px; flex-wrap: wrap; text-align: left;
        }
        .svc-cta-badge { color: #d62b1b; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
        .svc-cta-title { font-size: 30px; font-weight: 900; color: #fff; margin: 0 0 10px; line-height: 1.25; }
        .svc-cta-sub { font-size: 15px; color: #64748b; margin: 0; }
        .svc-cta-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .svc-cta-primary {
          padding: 15px 32px; background: #d62b1b; border: none; border-radius: 12px;
          color: #fff; font-size: 15px; font-weight: 800; cursor: pointer;
          box-shadow: 0 8px 28px rgba(214,43,27,0.4); transition: all 0.25s; font-family: inherit;
        }
        .svc-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(214,43,27,0.5); }
        .svc-cta-secondary {
          padding: 15px 28px; background: transparent; border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px; color: #fff; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.25s; font-family: inherit;
        }
        .svc-cta-secondary:hover { border-color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.05); }

        @media (max-width: 1100px) { .svc-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 820px)  { .svc-grid { grid-template-columns: repeat(2, 1fr); } .svc-process-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px)  {
          .svc-hero { padding: 70px 16px 60px; }
          .svc-section { padding: 60px 16px 80px; }
          .svc-grid { grid-template-columns: 1fr; }
          .svc-process-grid { grid-template-columns: 1fr; }
          .svc-cta-section { padding: 36px 24px; }
          .svc-hero-stats { gap: 28px; }
        }
      `}</style>

      {/* ──── HERO ──── */}
      <section className="svc-hero">
        <div className="svc-hero-orb svc-hero-orb-1" />
        <div className="svc-hero-orb svc-hero-orb-2" />
        <div className="svc-hero-inner">
          <div className="svc-hero-eyebrow">
            <span>✦ WHAT WE DO</span>
          </div>
          <h1 className="svc-hero-title">
            Engineering <span className="red">Excellence</span><br />
            Across Every Service
          </h1>
          <p className="svc-hero-desc">
            From concept to completion — Dhanvij Builders delivers end-to-end civil engineering, construction, and design services across Maharashtra with unmatched precision and trust.
          </p>
          <div className="svc-hero-btns">
            <button className="svc-hero-btn-primary" onClick={() => document.getElementById('svc-cards')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Services ↓
            </button>
            <button className="svc-hero-btn-secondary" onClick={() => navigate('/')}>
              ← Back to Home
            </button>
          </div>
          <div className="svc-hero-stats">
            {[
              { num: "8+", label: "Services Offered" },
              { num: "150+", label: "Projects Completed" },
              { num: "12+", label: "Years Experience" },
              { num: "98%", label: "Client Satisfaction" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div className="svc-hero-stat-num">{s.num}</div>
                <div className="svc-hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── MAIN SECTION ──── */}
      <section className="svc-section" ref={sectionRef} id="svc-cards">
        <div className="svc-inner">

          {/* Filter Tabs */}
          <div className="svc-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`svc-filter-btn${filter === cat ? " active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="svc-grid">
            {visible.map((svc, i) => (
              <ServiceCard key={svc.id} svc={svc} index={i} />
            ))}
          </div>

          {/* ──── HOW IT WORKS ──── */}
          <div className="svc-process">
            <div className="svc-process-header">
              <div className="svc-section-eyebrow">⚙️ HOW WE WORK</div>
              <h2 className="svc-section-title">Our 6-Step Project Process</h2>
              <p className="svc-section-sub">A transparent, milestone-driven workflow designed to keep you informed and confident at every stage.</p>
            </div>
            <div className="svc-process-grid">
              {process.map((step, i) => (
                <div className="svc-process-card" key={i}>
                  <span className="svc-process-num">{step.step}</span>
                  <span className="svc-process-icon">{step.icon}</span>
                  <h4 className="svc-process-title">{step.title}</h4>
                  <p className="svc-process-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ──── CTA ──── */}
          <div className="svc-cta-section">
            <div>
              <div className="svc-cta-badge">📞 Ready to Start?</div>
              <h2 className="svc-cta-title">
                Let's Build Your Vision<br />Together
              </h2>
              <p className="svc-cta-sub">
                Talk to a senior engineer today — free consultation, no commitment.
              </p>
            </div>
            <div className="svc-cta-actions">
              <button className="svc-cta-primary" onClick={() => {
                if (window.location.pathname === "/") {
                  document.getElementById("enquiry-section")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/#enquiry-section");
                }
              }}>
                Get Free Consultation →
              </button>
              <button className="svc-cta-secondary" onClick={() => navigate("/projects")}>
                View Our Projects
              </button>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
