import React from "react";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          
          {/* Company Info */}
          <div className="footer-section">
            <h3>Dhanvij Builders</h3>
            <p>
              Delivering high-quality structural components and construction
              solutions for modern civil engineering projects.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>Home</li>
              <li>Services</li>
              <li>Projects</li>
              <li>About Us</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* Our Solutions */}
          <div className="footer-section">
            <h4>Our Solutions</h4>
            <ul>
              <li>Reinforcement Components</li>
              <li>Structural Steel Elements</li>
              <li>Precision Fabrication</li>
              <li>Construction Hardware</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: swapnildhanvij@gmail.com</p>
            <p>Phone: +91 72766 51565</p>
            <p>Location: Wardha, Maharashtra</p>
          </div>

        </div>

        {/* Bottom Bar (Your Section Added Here) */}
        <div className="footer-bottom">
          <div className="footer-inner">
            <div className="footer-left">
              Dhanvij Builders ©2026
            </div>

            <div className="footer-center">
              All rights reserved
            </div>

            <div className="footer-right">
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
              <span className="footer-separator">|</span>
              <a href="#" className="footer-link">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .footer {
          background-color: #0f172a;
          color: #e2e8f0;
          padding-top: 60px;
          font-family: 'Segoe UI', sans-serif;
        }

        .footer-container {
          max-width: 1200px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          padding: 0 20px 40px 20px;
        }

        .footer-section h3,
        .footer-section h4 {
          margin-bottom: 15px;
          color: #ffffff;
        }

        .footer-section p,
        .footer-section ul li {
          font-size: 14px;
          line-height: 1.6;
          color: #cbd5e1;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section ul li {
          margin-bottom: 8px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .footer-section ul li:hover {
          color: #f59e0b;
        }

        /* Bottom Bar */
        .footer-bottom {
          border-top: 1px solid  #0f172a;
          padding: 20px;
          background-color: #0f172a;
        }

        .footer-inner {
          max-width: 1200px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 13px;
          color: #94a3b8;
        }

        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: #f59e0b;
        }

        .footer-separator {
          margin: 0 8px;
        }

        @media (max-width: 768px) {
          .footer-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}

export default Footer;
