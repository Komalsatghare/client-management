import React from "react";

export default function StructuralSolutions() {
  return (
    <>
      <section className="solutions-section">
        <div className="container">
          <h2 className="section-title">Our Structural Solutions</h2>
          <p className="section-subtitle">
            Engineered components designed to meet the demanding standards of
            modern civil and infrastructure projects.
          </p>

          <div className="solutions-grid">
            <div className="solution-card">
              <h3>Reinforcement Components</h3>
              <p>
                High-strength reinforcement materials designed to improve load
                capacity and structural stability in concrete constructions.
              </p>
            </div>

            <div className="solution-card">
              <h3>Structural Steel Elements</h3>
              <p>
                Precision-engineered steel sections used in buildings, bridges,
                and heavy infrastructure projects.
              </p>
            </div>

            <div className="solution-card">
              <h3>Precision Fabricated Parts</h3>
              <p>
                Custom metal components manufactured with advanced machining
                for accuracy and durability.
              </p>
            </div>

            <div className="solution-card">
              <h3>Construction Hardware</h3>
              <p>
                Heavy-duty bolts, anchors, brackets, and connectors built for
                demanding structural applications.
              </p>
            </div>

            <div className="solution-card">
              <h3>Custom Civil Engineering Components</h3>
              <p>
                Project-specific structural components designed to meet unique
                engineering requirements and compliance standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .solutions-section {
          padding: 80px 20px;
          background-color: #f8fafc;
          font-family: 'Segoe UI', sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: auto;
          text-align: center;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 15px;
        }

        .section-subtitle {
          font-size: 16px;
          color: #475569;
          max-width: 700px;
          margin: 0 auto 50px auto;
        }

        .solutions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .solution-card {
          background: #ffffff;
          padding: 30px 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          text-align: left;
        }

        .solution-card h3 {
          font-size: 20px;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .solution-card p {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
        }

        .solution-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 28px;
          }

          .section-subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}
