import React from "react";

const WhyChooseUs = () => {
  return (
    <>
      <section className="why-choose-us">
        <div className="container">

          <h2 className="section-title" style={{color: "#f8fafc"}}>Why Choose Dhanvij Builders</h2>

          <div className="features-grid">

            <div className="feature">
              <div className="icon">🏗️</div>
              <p>Experienced Civil Engineering Team</p>
            </div>

            <div className="feature">
              <div className="icon">📐</div>
              <p>Precision Structural Planning</p>
            </div>

            <div className="feature">
              <div className="icon">🛡️</div>
              <p>Fully Licensed & Certified</p>
            </div>

            <div className="feature">
              <div className="icon">⏳</div>
              <p>On-Time Project Delivery</p>
            </div>

            <div className="feature">
              <div className="icon">🧱</div>
              <p>Premium Quality Materials</p>
            </div>

            <div className="feature">
              <div className="icon">💰</div>
              <p>Transparent & Fair Pricing</p>
            </div>

            <div className="feature">
              <div className="icon">📋</div>
              <p>No Hidden Charges</p>
            </div>

            <div className="feature">
              <div className="icon">🤝</div>
              <p>Client-Focused Approach</p>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .why-choose-us {
          background: linear-gradient(to right, #1e3a5f, #0f1f35);
          padding: 90px 20px;
          color: white;
        }
          .section-title{
          text-color: #f8fafc;}

        .container {
          max-width: 1100px;
          margin: auto;
          text-align: center;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 60px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255,255,255,0.2);
          border-left: 1px solid rgba(255,255,255,0.2);
        }

        .feature {
          padding: 40px 20px;
          border-right: 1px solid rgba(255,255,255,0.2);
          border-bottom: 1px solid rgba(255,255,255,0.2);
          transition: background 0.3s ease;
        }

        .feature:hover {
          background: rgba(255,255,255,0.05);
        }

        .icon {
          font-size: 40px;
          margin-bottom: 15px;
        }

        .feature p {
          font-size: 14px;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .features-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
};

export default WhyChooseUs;
