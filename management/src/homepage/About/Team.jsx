import React from "react";

export default function Team() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .ab-team {
          background: #0f172a;
          padding: 72px 24px 90px;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        .ab-team-inner { max-width: 860px; margin: 0 auto; }

        /* Section label */
        .ab-team-label {
          text-align: center; margin-bottom: 48px;
        }
        .ab-team-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(214,43,27,0.1); border: 1px solid rgba(214,43,27,0.25);
          padding: 6px 18px; border-radius: 50px; margin-bottom: 14px;
          font-size: 11px; color: #d62b1b; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
        }
        .ab-team-title { font-size: 32px; font-weight: 900; color: #fff; margin: 0; }

        /* Profile card */
        .ab-profile {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 36px;
          display: flex; align-items: flex-start; gap: 32px;
          transition: border-color 0.3s;
        }
        .ab-profile:hover { border-color: rgba(214,43,27,0.25); }

        /* Avatar */
        .ab-avatar-wrap { flex-shrink: 0; text-align: center; }
        .ab-avatar {
          width: 120px; height: 120px; border-radius: 50%;
          object-fit: cover; display: block;
          border: 3px solid rgba(214,43,27,0.4);
          box-shadow: 0 8px 30px rgba(0,0,0,0.4), 0 0 0 6px rgba(214,43,27,0.08);
          margin-bottom: 12px;
        }
        .ab-avatar-name { font-size: 15px; font-weight: 800; color: #f1f5f9; margin-bottom: 2px; }
        .ab-avatar-role {
          font-size: 11px; font-weight: 700; color: #d62b1b;
          text-transform: uppercase; letter-spacing: 1px;
        }

        /* Bio */
        .ab-bio { flex: 1; }
        .ab-bio p {
          font-size: 14px; color: #94a3b8; line-height: 1.8; margin: 0 0 14px;
        }
        .ab-bio p:last-child { margin: 0; }

        /* Skill pills */
        .ab-skills { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }
        .ab-skill {
          padding: 5px 13px; border-radius: 20px; font-size: 11px; font-weight: 700;
          background: rgba(214,43,27,0.1); border: 1px solid rgba(214,43,27,0.25);
          color: #f87171; letter-spacing: 0.3px;
        }

        @media (max-width: 620px) {
          .ab-profile { flex-direction: column; align-items: center; text-align: center; gap: 24px; }
          .ab-skills { justify-content: center; }
          .ab-team { padding: 52px 16px 70px; }
        }
      `}</style>

      <section className="ab-team">
        <div className="ab-team-inner">

          {/* Label */}
          <div className="ab-team-label">
            <div className="ab-team-eyebrow">👷 OUR TEAM</div>
            <h2 className="ab-team-title">The People Behind the Work</h2>
          </div>

          {/* Profile card */}
          <div className="ab-profile">
            {/* Avatar */}
            <div className="ab-avatar-wrap">
              <div className="ab-avatar-name">Swapnil Dhanvij</div>
              <div className="ab-avatar-role">Civil Engineer & Founder</div>
            </div>

            {/* Bio */}
            <div className="ab-bio">
              <p>
                Swapnil Dhanvij is a highly experienced civil engineer with over a decade of expertise in planning, designing, and managing construction projects. He has successfully overseen residential, commercial, and industrial developments — ensuring every project is delivered on time to the highest quality standards.
              </p>
              <p>
                He specializes in structural engineering, project management, and sustainable construction techniques, consistently implementing practical solutions that optimize cost and efficiency. Committed to continuous improvement, Swapnil stays current with modern construction practices and evolving industry standards.
              </p>
              <p>
                Outside of work, he enjoys mentoring young engineers and contributing to community construction initiatives across Wardha, Maharashtra.
              </p>
              <div className="ab-skills">
                {["Structural Engineering", "Project Management", "Residential Construction", "Commercial Buildings", "Land Development", "Interior Solutions"].map((sk) => (
                  <span className="ab-skill" key={sk}>{sk}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
