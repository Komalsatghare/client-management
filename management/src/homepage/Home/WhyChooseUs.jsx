import React, { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: "🏗️",
    title: "Experienced Engineering Team",
    desc: "Our senior civil engineers bring decades of hands-on experience across residential, commercial, and infrastructure projects.",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    glow: "rgba(245,158,11,0.3)",
  },
  {
    icon: "📐",
    title: "Precision Structural Planning",
    desc: "Every project starts with rigorous structural analysis, load calculations, and compliance-first design documentation.",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    glow: "rgba(59,130,246,0.3)",
  },
  {
    icon: "🛡️",
    title: "Fully Licensed & Certified",
    desc: "All our engineers are certified professionals. Our projects meet BIS standards, local municipal codes, and safety regulations.",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    icon: "⏱️",
    title: "On-Time Project Delivery",
    desc: "We work to aggressive but realistic timelines, using milestone-driven planning to guarantee on-schedule delivery every time.",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    icon: "🧱",
    title: "Premium Quality Materials",
    desc: "We source only ISI-marked, tested materials — from TMT bars to concrete — ensuring structural integrity for decades.",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    glow: "rgba(239,68,68,0.3)",
  },
  {
    icon: "💰",
    title: "Transparent & Fair Pricing",
    desc: "Detailed itemised quotations with zero surprise additions. You know exactly where every rupee goes.",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    glow: "rgba(6,182,212,0.3)",
  },
  {
    icon: "📋",
    title: "No Hidden Charges",
    desc: "What we quote is what you pay. Our contracts are comprehensive and signed before any work begins on-site.",
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    glow: "rgba(249,115,22,0.3)",
  },
  {
    icon: "🤝",
    title: "Client-Focused Approach",
    desc: "Regular site updates, responsive project managers, and a dedicated point of contact throughout your project journey.",
    gradient: "linear-gradient(135deg, #ec4899, #db2777)",
    glow: "rgba(236,72,153,0.3)",
  },
];

function FeatureCard({ feature, index, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="wcu-card"
      style={{
        animationDelay: `${index * 80}ms`,
        animationPlayState: inView ? "running" : "paused",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow bg */}
      <div
        className="wcu-card-glow"
        style={{
          background: feature.gradient,
          opacity: hovered ? 0.08 : 0,
        }}
      />
      {/* Top border accent */}
      <div
        className="wcu-card-border"
        style={{
          background: feature.gradient,
          opacity: hovered ? 1 : 0,
        }}
      />
      <div
        className="wcu-icon"
        style={{
          background: feature.gradient,
          boxShadow: hovered ? `0 10px 30px ${feature.glow}` : "none",
        }}
      >
        {feature.icon}
      </div>
      <h3 className="wcu-card-title">{feature.title}</h3>
      <p className="wcu-card-desc">{feature.desc}</p>
    </div>
  );
}

export default function WhyChooseUs() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .wcu-section {
          padding: 100px 24px;
          background: linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
          font-family: 'Inter', 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Subtle grid pattern */
        .wcu-section::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(214,43,27,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%);
        }

        .wcu-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

        /* Header */
        .wcu-header { text-align: center; margin-bottom: 72px; }
        .wcu-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(214,43,27,0.1); border: 1px solid rgba(214,43,27,0.3);
          padding: 7px 20px; border-radius: 50px; margin-bottom: 20px;
        }
        .wcu-eyebrow span { color: #d62b1b; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }

        .wcu-title {
          font-size: clamp(30px, 4.5vw, 52px); font-weight: 900;
          color: #fff; margin: 0 0 16px; line-height: 1.15;
          letter-spacing: -0.5px;
        }
        .wcu-title-red { color: #d62b1b; }
        .wcu-subtitle { font-size: 17px; color: #64748b; max-width: 560px; margin: 0 auto; line-height: 1.7; }

        /* Grid */
        .wcu-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        /* Card */
        .wcu-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 28px 22px 26px;
          position: relative; overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.34,1.36,0.64,1),
                      box-shadow 0.35s, border-color 0.35s;
          cursor: default;
          animation: wcuFadeUp 0.5s ease both;
        }
        @keyframes wcuFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wcu-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.14);
        }
        .wcu-card-glow {
          position: absolute; inset: 0; pointer-events: none;
          border-radius: 18px; transition: opacity 0.3s;
        }
        .wcu-card-border {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          border-radius: 18px 18px 0 0; transition: opacity 0.3s;
        }

        .wcu-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 16px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .wcu-card:hover .wcu-icon { transform: scale(1.12) rotate(-5deg); }

        .wcu-card-title { font-size: 15px; font-weight: 700; color: #f1f5f9; margin: 0 0 10px; line-height: 1.35; }
        .wcu-card-desc { font-size: 13px; color: #64748b; line-height: 1.7; margin: 0; }

        /* Trust bar */
        .wcu-trust {
          margin-top: 64px;
          display: flex; align-items: center; justify-content: center;
          gap: 40px; flex-wrap: wrap;
          padding: 28px 32px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
        }
        .wcu-trust-item { display: flex; align-items: center; gap: 12px; }
        .wcu-trust-icon { font-size: 28px; }
        .wcu-trust-text { }
        .wcu-trust-num { font-size: 24px; font-weight: 900; color: #fff; line-height: 1; }
        .wcu-trust-label { font-size: 12px; color: #64748b; font-weight: 500; margin-top: 2px; }
        .wcu-trust-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }

        @media (max-width: 1024px) { .wcu-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 720px) { .wcu-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 460px) {
          .wcu-section { padding: 70px 16px; }
          .wcu-grid { grid-template-columns: 1fr; }
          .wcu-trust { gap: 20px; }
          .wcu-trust-divider { display: none; }
        }
      `}</style>

      <section className="wcu-section" ref={ref}>
        <div className="wcu-inner">
          {/* Header */}
          <div className="wcu-header">
            <div className="wcu-eyebrow">
              <span>✦ WHY CHOOSE US</span>
            </div>
            <h2 className="wcu-title">
              Why Thousands Choose<br />
              <span className="wcu-title-red">Dhanvij Builders</span>
            </h2>
            <p className="wcu-subtitle">
              From the first blueprint to the final handover, we deliver engineering
              excellence at every single step of your construction journey.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="wcu-grid">
            {features.map((f, i) => (
              <FeatureCard key={i} feature={f} index={i} inView={inView} />
            ))}
          </div>

          {/* Trust Bar */}
          <div className="wcu-trust">
            {[
              { icon: "🏆", num: "150+", label: "Projects Delivered" },
              { icon: "👷", num: "50+", label: "Expert Engineers" },
              { icon: "⭐", num: "4.9/5", label: "Client Rating" },
              { icon: "📍", num: "15+", label: "Cities Served" },
            ].map((t, i, arr) => (
              <React.Fragment key={i}>
                <div className="wcu-trust-item">
                  <span className="wcu-trust-icon">{t.icon}</span>
                  <div className="wcu-trust-text">
                    <div className="wcu-trust-num">{t.num}</div>
                    <div className="wcu-trust-label">{t.label}</div>
                  </div>
                </div>
                {i < arr.length - 1 && <div className="wcu-trust-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
