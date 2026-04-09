import React from "react";

export default function Hero() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .ab-hero {
          background: linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%);
          padding: 90px 24px 80px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .ab-hero-orb {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; opacity: 0.13;
        }
        .ab-hero-orb-1 { width: 440px; height: 440px; background: #d62b1b; top: -140px; right: -60px; }
        .ab-hero-orb-2 { width: 360px; height: 360px; background: #7c3aed; bottom: -100px; left: -60px; }

        .ab-hero-inner {
          max-width: 860px; margin: 0 auto;
          position: relative; z-index: 1; text-align: center;
        }
        .ab-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(214,43,27,0.12); border: 1px solid rgba(214,43,27,0.3);
          padding: 6px 18px; border-radius: 50px; margin-bottom: 22px;
          font-size: 11px; color: #d62b1b; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
        }
        .ab-hero-title {
          font-size: clamp(26px, 4vw, 44px); font-weight: 900;
          color: #fff; line-height: 1.25; margin: 0 0 16px; letter-spacing: -0.5px;
        }
        .ab-hero-title .red { color: #d62b1b; }
        .ab-hero-tagline {
          font-size: 15px; color: #64748b; line-height: 1.7;
          max-width: 600px; margin: 0 auto 52px; font-style: italic;
        }

        /* Two-column story */
        .ab-story {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 24px; text-align: left;
        }
        .ab-story-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 26px 24px;
          transition: border-color 0.3s, background 0.3s;
        }
        .ab-story-card:hover { border-color: rgba(214,43,27,0.3); background: rgba(214,43,27,0.03); }
        .ab-story-card p {
          font-size: 14px; color: #94a3b8; line-height: 1.8; margin: 0;
        }

        /* Stats row */
        .ab-stats {
          display: flex; gap: 0;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; overflow: hidden;
          margin-top: 32px;
        }
        .ab-stat {
          flex: 1; text-align: center; padding: 24px 16px;
          background: rgba(255,255,255,0.03);
          border-right: 1px solid rgba(255,255,255,0.08);
          transition: background 0.3s;
        }
        .ab-stat:last-child { border-right: none; }
        .ab-stat:hover { background: rgba(214,43,27,0.06); }
        .ab-stat-num { font-size: 30px; font-weight: 900; color: #fff; line-height: 1; margin-bottom: 4px; }
        .ab-stat-label { font-size: 12px; color: #64748b; font-weight: 500; }

        @media (max-width: 680px) {
          .ab-hero { padding: 70px 16px 60px; }
          .ab-story { grid-template-columns: 1fr; }
          .ab-stats { flex-wrap: wrap; }
          .ab-stat { flex: 1 1 45%; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .ab-stat:last-child { border-bottom: none; }
        }
      `}</style>

      <section className="ab-hero">
        <div className="ab-hero-orb ab-hero-orb-1" />
        <div className="ab-hero-orb ab-hero-orb-2" />

        <div className="ab-hero-inner">
          <div className="ab-eyebrow">✦ ABOUT US</div>

          <h1 className="ab-hero-title">
            Building Trust, One<br />
            <span className="red">Structure</span> at a Time
          </h1>

          <p className="ab-hero-tagline">
            "A building is not just concrete and steel — it is trust, vision, and the foundation of someone's future."
          </p>

          {/* Story cards */}
          <div className="ab-story">
            <div className="ab-story-card">
              <p>
                Established on 6th January 2025, Dhanvij Builders was founded with a clear vision — to deliver quality-driven and reliable building solutions. With hands-on experience and a strong commitment to craftsmanship, we have successfully completed residential and commercial projects in and around Wardha, Maharashtra.
              </p>
            </div>
            <div className="ab-story-card">
              <p>
                We specialize in residential construction, commercial buildings, interior solutions, land development, and real estate services. Our approach is centered on client satisfaction, transparency in communication, and on-time delivery — ensuring every project is built to last.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="ab-stats">
            {[
              { num: "2025", label: "Founded" },
              { num: "5+", label: "Projects Completed" },
              { num: "Wardha", label: "Headquarters" },
              { num: "100%", label: "Client Focused" },
            ].map((s, i) => (
              <div className="ab-stat" key={i}>
                <div className="ab-stat-num">{s.num}</div>
                <div className="ab-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
