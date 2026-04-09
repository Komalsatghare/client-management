import React, { useEffect, useRef, useState } from "react";

const solutions = [
  {
    icon: "🏗️",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    glow: "rgba(239,68,68,0.35)",
    title: "Reinforcement Components",
    desc: "High-strength reinforcement materials engineered to amplify load capacity and structural stability in concrete constructions across all scales.",
    tags: ["TMT Bars", "Stirrups", "Mesh"],
  },
  {
    icon: "⚙️",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    glow: "rgba(59,130,246,0.35)",
    title: "Structural Steel Elements",
    desc: "Precision-engineered steel sections fabricated for buildings, bridges, flyovers, and heavy civil infrastructure projects worldwide.",
    tags: ["I-Beams", "Channels", "Angles"],
  },
  {
    icon: "🔩",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    glow: "rgba(16,185,129,0.35)",
    title: "Precision Fabricated Parts",
    desc: "Custom metal components manufactured with CNC machining and advanced fabrication techniques for superior accuracy and durability.",
    tags: ["CNC Parts", "Plates", "Gussets"],
  },
  {
    icon: "🧱",
    gradient: "linear-gradient(135deg, #f97316, #ea580c)",
    glow: "rgba(249,115,22,0.35)",
    title: "Construction Hardware",
    desc: "Heavy-duty anchor bolts, expansion anchors, structural brackets and connectors built for the most demanding structural applications.",
    tags: ["Bolts", "Anchors", "Brackets"],
  },
  {
    icon: "📐",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    glow: "rgba(139,92,246,0.35)",
    title: "Custom Civil Engineering",
    desc: "Project-specific structural components designed and certified to meet unique engineering requirements and compliance standards.",
    tags: ["Design", "Certified", "Custom"],
  },
];

const stats = [
  { value: 150, suffix: "+", label: "Projects Completed" },
  { value: 12, suffix: "+", label: "Years of Experience" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 50, suffix: "+", label: "Expert Engineers" },
];

function CountUp({ target, suffix, active }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 22);
    return () => clearInterval(timer);
  }, [active, target]);
  return <>{count}{suffix}</>;
}

export default function StructuralSolutions() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .ss-section {
          padding: 100px 24px;
          background: #0f172a;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .ss-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .ss-inner { max-width: 1240px; margin: 0 auto; position: relative; z-index: 1; }

        /* Header */
        .ss-header { text-align: center; margin-bottom: 72px; }
        .ss-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(214,43,27,0.1); border: 1px solid rgba(214,43,27,0.3);
          padding: 6px 18px; border-radius: 50px; margin-bottom: 20px;
        }
        .ss-eyebrow-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #d62b1b;
          animation: ssPulse 1.5s infinite;
        }
        @keyframes ssPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(214,43,27,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(214,43,27,0); }
        }
        .ss-eyebrow span { color: #d62b1b; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }

        .ss-title {
          font-size: clamp(30px, 4.5vw, 52px); font-weight: 900;
          color: #fff; line-height: 1.15; margin: 0 0 16px;
          letter-spacing: -0.5px;
        }
        .ss-title .red { color: #d62b1b; }
        .ss-subtitle {
          font-size: 17px; color: #64748b; max-width: 580px;
          margin: 0 auto; line-height: 1.7;
        }

        /* Stats Bar */
        .ss-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 72px;
        }
        .ss-stat {
          background: rgba(15,23,42,0.8);
          padding: 28px 24px;
          text-align: center;
          transition: background 0.3s;
        }
        .ss-stat:hover { background: rgba(214,43,27,0.08); }
        .ss-stat-num {
          font-size: 40px; font-weight: 900; color: #fff;
          line-height: 1; margin-bottom: 6px;
          background: linear-gradient(135deg, #fff, #94a3b8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ss-stat-label { font-size: 13px; color: #64748b; font-weight: 500; }

        /* Solutions Grid */
        .ss-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 72px;
        }
        .ss-grid-bottom {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          max-width: 720px;
          margin: 0 auto 0;
        }

        .ss-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px 28px;
          cursor: default;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.35s, border-color 0.35s, background 0.3s;
          position: relative;
          overflow: hidden;
        }
        .ss-card-glow {
          position: absolute; inset: 0; border-radius: 20px;
          opacity: 0; transition: opacity 0.35s;
          pointer-events: none;
        }
        .ss-card:hover { transform: translateY(-8px) scale(1.02); border-color: rgba(255,255,255,0.16); }
        .ss-card:hover .ss-card-glow { opacity: 1; }
        .ss-card:hover { background: rgba(255,255,255,0.05); }

        .ss-icon-wrap {
          width: 60px; height: 60px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; margin-bottom: 20px;
          transition: transform 0.3s;
        }
        .ss-card:hover .ss-icon-wrap { transform: scale(1.12) rotate(-4deg); }

        .ss-card-title {
          font-size: 18px; font-weight: 700; color: #f1f5f9;
          margin-bottom: 10px; line-height: 1.3;
        }
        .ss-card-desc {
          font-size: 14px; color: #64748b; line-height: 1.75; margin-bottom: 18px;
        }
        .ss-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .ss-tag {
          padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.5px; text-transform: uppercase;
          border: 1px solid;
        }

        /* CTA */
        .ss-cta {
          margin-top: 64px;
          background: linear-gradient(135deg, rgba(214,43,27,0.15), rgba(214,43,27,0.05));
          border: 1px solid rgba(214,43,27,0.25);
          border-radius: 20px;
          padding: 48px 40px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px; flex-wrap: wrap;
        }
        .ss-cta-left {}
        .ss-cta-label { color: #d62b1b; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
        .ss-cta-title { font-size: 26px; font-weight: 800; color: #fff; margin: 0 0 8px; line-height: 1.3; }
        .ss-cta-sub { font-size: 15px; color: #64748b; margin: 0; }
        .ss-cta-btn {
          background: #d62b1b; color: #fff;
          border: none; padding: 15px 32px; border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          transition: all 0.25s; white-space: nowrap;
          box-shadow: 0 8px 30px rgba(214,43,27,0.4);
        }
        .ss-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(214,43,27,0.5); filter: brightness(1.1); }

        @media (max-width: 960px) {
          .ss-stats { grid-template-columns: repeat(2, 1fr); }
          .ss-grid { grid-template-columns: repeat(2, 1fr); }
          .ss-grid-bottom { grid-template-columns: 1fr; max-width: 100%; }
        }
        @media (max-width: 600px) {
          .ss-section { padding: 70px 16px; }
          .ss-stats { grid-template-columns: repeat(2, 1fr); }
          .ss-grid { grid-template-columns: 1fr; }
          .ss-cta { padding: 32px 24px; }
        }
      `}</style>

      <section className="ss-section" ref={sectionRef}>
        <div className="ss-grid-bg" />

        <div className="ss-inner">
          {/* Header */}
          <div className="ss-header">
            <div className="ss-eyebrow">
              <span className="ss-eyebrow-dot" />
              <span>OUR EXPERTISE</span>
            </div>
            <h2 className="ss-title">
              Engineering <span className="red">Solutions</span> Built<br />
              to Last Generations
            </h2>
            <p className="ss-subtitle">
              From reinforced concrete structures to precision fabrication — every component
              we deliver is engineered to exceed load requirements and last decades.
            </p>
          </div>

          {/* Stats */}
          <div className="ss-stats">
            {stats.map((s, i) => (
              <div className="ss-stat" key={i}>
                <div className="ss-stat-num">
                  <CountUp target={s.value} suffix={s.suffix} active={inView} />
                </div>
                <div className="ss-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Top 3 cards */}
          <div className="ss-grid">
            {solutions.slice(0, 3).map((sol, i) => (
              <div
                className="ss-card"
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="ss-card-glow"
                  style={{ boxShadow: `inset 0 0 60px ${sol.glow}` }}
                />
                <div
                  className="ss-icon-wrap"
                  style={{ background: sol.gradient, boxShadow: `0 8px 24px ${sol.glow}` }}
                >
                  {sol.icon}
                </div>
                <div className="ss-card-title">{sol.title}</div>
                <div className="ss-card-desc">{sol.desc}</div>
                <div className="ss-tags">
                  {sol.tags.map((tag, t) => (
                    <span
                      key={t}
                      className="ss-tag"
                      style={{
                        background: hoveredCard === i ? sol.glow : "rgba(255,255,255,0.04)",
                        borderColor: hoveredCard === i ? sol.glow : "rgba(255,255,255,0.1)",
                        color: hoveredCard === i ? "#fff" : "#64748b",
                        transition: "all 0.3s",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom 2 cards */}
          <div className="ss-grid-bottom">
            {solutions.slice(3).map((sol, i) => (
              <div
                className="ss-card"
                key={i + 3}
                onMouseEnter={() => setHoveredCard(i + 3)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="ss-card-glow"
                  style={{ boxShadow: `inset 0 0 60px ${sol.glow}` }}
                />
                <div
                  className="ss-icon-wrap"
                  style={{ background: sol.gradient, boxShadow: `0 8px 24px ${sol.glow}` }}
                >
                  {sol.icon}
                </div>
                <div className="ss-card-title">{sol.title}</div>
                <div className="ss-card-desc">{sol.desc}</div>
                <div className="ss-tags">
                  {sol.tags.map((tag, t) => (
                    <span
                      key={t}
                      className="ss-tag"
                      style={{
                        background: hoveredCard === i + 3 ? sol.glow : "rgba(255,255,255,0.04)",
                        borderColor: hoveredCard === i + 3 ? sol.glow : "rgba(255,255,255,0.1)",
                        color: hoveredCard === i + 3 ? "#fff" : "#64748b",
                        transition: "all 0.3s",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="ss-cta">
            <div className="ss-cta-left">
              <div className="ss-cta-label">Ready to Build?</div>
              <h3 className="ss-cta-title">
                Let's engineer your next<br />structural milestone together
              </h3>
              <p className="ss-cta-sub">
                Talk to our engineers and get a customized quote for your project.
              </p>
            </div>
            <button
              className="ss-cta-btn"
              onClick={() => {
                const el = document.getElementById("enquiry-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get Free Consultation →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
