import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectsHero({ totalCount }) {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .ph-section {
          background: linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%);
          padding: 90px 24px 70px;
          text-align: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        .ph-orb {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; opacity: 0.14;
        }
        .ph-orb-1 { width: 480px; height: 480px; background: #d62b1b; top: -160px; right: -60px; }
        .ph-orb-2 { width: 380px; height: 380px; background: #7c3aed; bottom: -100px; left: -60px; }
        .ph-inner { max-width: 700px; margin: 0 auto; position: relative; z-index: 1; }
        .ph-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(214,43,27,0.12); border: 1px solid rgba(214,43,27,0.3);
          padding: 6px 18px; border-radius: 50px; margin-bottom: 22px;
          font-size: 11px; color: #d62b1b; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
        }
        .ph-title {
          font-size: clamp(34px, 6vw, 60px); font-weight: 900;
          color: #fff; line-height: 1.1; margin: 0 0 18px; letter-spacing: -1px;
        }
        .ph-title .red { color: #d62b1b; }
        .ph-desc { font-size: 17px; color: #64748b; line-height: 1.75; margin: 0 0 36px; }
        .ph-meta {
          display: inline-flex; align-items: center; gap: 24px;
          padding: 14px 24px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50px; flex-wrap: wrap; justify-content: center;
        }
        .ph-meta-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #94a3b8; }
        .ph-meta-dot { width: 6px; height: 6px; border-radius: 50%; background: #d62b1b; }
        .ph-meta-num { font-weight: 800; color: #fff; }
      `}</style>
      <section className="ph-section">
        <div className="ph-orb ph-orb-1" />
        <div className="ph-orb ph-orb-2" />
        <div className="ph-inner">
          <div className="ph-eyebrow">✦ PORTFOLIO</div>
          <h1 className="ph-title">
            Landmark <span className="red">Projects</span><br />
            Across Maharashtra
          </h1>
          <p className="ph-desc">
            Every project we deliver reflects our commitment to structural integrity, design excellence, and on-time completion. Browse our portfolio below.
          </p>
          <div className="ph-meta">
            <div className="ph-meta-item">
              <span className="ph-meta-dot" />
              <span><span className="ph-meta-num">{totalCount || "—"}</span> Projects Showcased</span>
            </div>
            <div className="ph-meta-item">
              <span className="ph-meta-dot" />
              <span><span className="ph-meta-num">12+</span> Years Experience</span>
            </div>
            <div className="ph-meta-item">
              <span className="ph-meta-dot" />
              <span><span className="ph-meta-num">98%</span> Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
