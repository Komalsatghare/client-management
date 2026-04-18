import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleViewProjects = () => {
    navigate('/projects');
  };

  const handleGetQuote = () => {
    setIsPopupOpen(true);
  };

  return (
    <>
      <style>
        {`
          .hero {
            min-height: calc(100vh - 72px);
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(
              rgba(0, 0, 0, 0.55),
              rgba(0, 0, 0, 0.55)
            ),
            url("https://images.unsplash.com/photo-1503387762-592deb58ef4e");
            background-size: cover;
            background-position: center;
            font-family: "Segoe UI", sans-serif;
            text-align: center;
            padding: 40px;
          }

          .hero-content {
            max-width: 800px;
            color: #ffffff;
          }

          .hero-content h1 {
            font-size: 52px;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 20px;
            letter-spacing: 1px;
          }

          .hero-content p {
            font-size: 20px;
            line-height: 1.7;
            margin-bottom: 35px;
            color: #f1f1f1;
          }

          .hero-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
          }

          .primary-btn {
            padding: 14px 32px;
            background-color: #b07a2a;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 17px;
            cursor: pointer;
            font-weight: 600;
          }

          .secondary-btn {
            padding: 14px 32px;
            background-color: transparent;
            color: #ffffff;
            border: 2px solid #ffffff;
            border-radius: 8px;
            font-size: 17px;
            cursor: pointer;
            font-weight: 600;
          }

          .hero-services {
            display: flex;
            justify-content: center;
            gap: 30px;
            font-size: 16px;
            font-weight: 500;
          }

          .hero-services span {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(4px);
          }

          .popup-content {
            background: white;
            padding: 35px 30px;
            border-radius: 16px;
            text-align: center;
            width: 90%;
            max-width: 420px;
            color: #1f2937;
            position: relative;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            animation: popupScale 0.3s ease-out;
          }

          @keyframes popupScale {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          .close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #9ca3af;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
          }

          .close-btn:hover {
            color: #1f2937;
            background-color: #f3f4f6;
          }

          .contact-options {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-top: 30px;
          }

          .contact-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 16px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .contact-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }

          .btn-call {
            background-color: #1e3a8a; /* Deep blue fitting corporate theme */
            color: white;
          }
          .btn-call:hover { background-color: #1e40af; }

          .btn-whatsapp {
            background-color: #25d366; /* Exact WhatsApp color */
            color: white;
          }
          .btn-whatsapp:hover { background-color: #128c7e; }

          .btn-email {
            background-color: #b91c1c; /* Deep red for email */
            color: white;
          }
          .btn-email:hover { background-color: #991b1b; }

          @media (max-width: 768px) {
            .hero-content h1 {
              font-size: 38px;
            }

            .hero-content p {
              font-size: 17px;
            }

            .hero-buttons {
              flex-direction: column;
            }
          }
        `}
      </style>

      <section className="hero">
        <div className="hero-content">
          <h1>Building Reliable Spaces for Modern Living</h1>

          <p>
            From residential homes to commercial projects and renovations,
            Dhanvij Builders delivers quality, trust, and excellence in every structure.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={handleViewProjects}>
              View Projects
            </button>

            <button className="secondary-btn" onClick={() => document.getElementById("enquiry-section")?.scrollIntoView({ behavior: "smooth" })}>
              Get Free Consultation
            </button>
          </div>

        </div>
      </section>

      {/* Contact Popup */}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsPopupOpen(false)}>
              &times;
            </button>

            <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px", color: "#111827" }}>
              Get in Touch
            </h2>
            <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "8px", lineHeight: "1.5" }}>
              Have questions or need a quote? Reach out to us directly through your preferred method.
            </p>

            <div className="contact-options">
              <a href="tel:+917276651565" className="contact-btn btn-call">
                📞 Call Us Directly
              </a>
              <a href="https://wa.me/917276651565" target="_blank" rel="noopener noreferrer" className="contact-btn btn-whatsapp">
                💬 Message on WhatsApp
              </a>
              <a
                href="mailto:swapnildhanvij@gmail.com?subject=Inquiry%20from%20Website&body=Hi%20Dhanvij%20Builders,%0A%0AI%20would%20like%20to%20get%20more%20information%20about..."
                className="contact-btn btn-email"
              >
                📩 Send an Email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeroSection;
