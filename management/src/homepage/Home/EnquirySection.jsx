import React, { useState } from "react";
import bgImage from "../../assets/construction-bg.png";
import { API_BASE_URL } from "../../config";


const services = [
  "Residential Construction",
  "Commercial Construction",
  "Industrial Construction",
  "Structural Renovation",
  "Electrical Work",
  "Civil Engineering Consultancy",
  "Project Management",
];

const contactInfo = [
  { icon: "📍", label: "Our Office", value: "Wardha, Maharashtra, India" },
  { icon: "📞", label: "Call Us", value: "+91 72766 51565" },
  { icon: "✉️", label: "Email Us", value: "swapnildhanvij@gmail.com" },
  { icon: "🕐", label: "Working Hours", value: "Mon – Sat, 9am – 7pm" },
];

function EnquirySection() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", service: "", message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const token = localStorage.getItem('clientAuthToken');
    if (!token) {
      setSubmitStatus("unauthorized");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .enq-section {
          position: relative;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          background: url(${bgImage}) center/cover no-repeat fixed;
          overflow: hidden;
        }
        .enq-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(10,15,30,0.97) 0%, rgba(10,15,30,0.88) 50%, rgba(10,15,30,0.75) 100%);
        }
        .enq-inner {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
          padding: 100px 24px;
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 72px;
          align-items: start;
        }

        /* ── Left Panel ── */
        .enq-left {}
        .enq-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(214,43,27,0.12); border: 1px solid rgba(214,43,27,0.35);
          padding: 7px 18px; border-radius: 50px; margin-bottom: 20px;
        }
        .enq-eyebrow span { color: #d62b1b; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .enq-title {
          font-size: clamp(28px, 3.5vw, 44px); font-weight: 900; color: #fff;
          margin: 0 0 16px; line-height: 1.2; letter-spacing: -0.5px;
        }
        .enq-title-red { color: #d62b1b; }
        .enq-desc { font-size: 16px; color: #64748b; line-height: 1.75; margin-bottom: 40px; }

        /* Contact Info Items */
        .enq-contacts { display: flex; flex-direction: column; gap: 18px; margin-bottom: 40px; }
        .enq-contact-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          transition: border-color 0.3s, background 0.3s;
          cursor: default;
        }
        .enq-contact-item:hover {
          border-color: rgba(214,43,27,0.35);
          background: rgba(214,43,27,0.05);
        }
        .enq-contact-icon { font-size: 22px; flex-shrink: 0; line-height: 1.4; }
        .enq-contact-label { font-size: 11px; color: #d62b1b; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px; }
        .enq-contact-value { font-size: 14px; color: #e2e8f0; font-weight: 500; }

        /* Promise pills */
        .enq-promises { display: flex; gap: 10px; flex-wrap: wrap; }
        .enq-promise {
          display: flex; align-items: center; gap: 6px;
          background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2);
          padding: 6px 14px; border-radius: 50px;
          font-size: 12px; color: #34d399; font-weight: 600;
        }

        /* ── Right Panel (Form) ── */
        .enq-form-card {
          background: rgba(15,23,42,0.85);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 40px 36px;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .enq-form-header { margin-bottom: 28px; }
        .enq-form-title { font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 6px; }
        .enq-form-sub { font-size: 13px; color: #64748b; margin: 0; }

        .enq-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .enq-field { display: flex; flex-direction: column; gap: 6px; }
        .enq-field.full { grid-column: span 2; }
        .enq-field label { font-size: 12px; font-weight: 600; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; }

        .enq-input, .enq-select, .enq-textarea {
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #fff; font-size: 14px; font-family: inherit;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%; box-sizing: border-box;
        }
        .enq-input::placeholder, .enq-textarea::placeholder { color: #475569; }
        .enq-select { color: #fff; cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center;
          padding-right: 36px;
        }
        .enq-select option { background: #1e293b; color: #fff; }
        .enq-textarea { resize: vertical; min-height: 110px; }
        .enq-input:focus, .enq-select:focus, .enq-textarea:focus {
          border-color: #d62b1b;
          box-shadow: 0 0 0 3px rgba(214,43,27,0.15);
          background: rgba(214,43,27,0.04);
        }

        .enq-submit {
          grid-column: span 2;
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #d62b1b, #b91c1c);
          border: none; border-radius: 12px;
          color: #fff; font-size: 15px; font-weight: 800;
          cursor: pointer; letter-spacing: 0.5px;
          transition: all 0.25s;
          box-shadow: 0 8px 28px rgba(214,43,27,0.4);
          font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .enq-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(214,43,27,0.5);
          filter: brightness(1.08);
        }
        .enq-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Spinner */
        .enq-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: enqSpin 0.7s linear infinite;
        }
        @keyframes enqSpin { to { transform: rotate(360deg); } }

        /* Success / Error */
        .enq-alert {
          grid-column: span 2;
          padding: 14px 18px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          display: flex; align-items: flex-start; gap: 10px;
        }
        .enq-alert.success {
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
          color: #34d399;
        }
        .enq-alert.error {
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
        }
        .enq-alert.warning {
          background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3);
          color: #fbbf24;
        }

        @media (max-width: 900px) {
          .enq-inner { grid-template-columns: 1fr; gap: 48px; padding: 70px 20px; }
          .enq-form-grid { grid-template-columns: 1fr; }
          .enq-field.full { grid-column: span 1; }
          .enq-submit { grid-column: span 1; }
          .enq-alert { grid-column: span 1; }
          .enq-form-card { padding: 28px 20px; }
        }
      `}</style>

      <section className="enq-section" id="enquiry-section">
        <div className="enq-overlay" />

        <div className="enq-inner">
          {/* ── Left ── */}
          <div className="enq-left">
            <div className="enq-eyebrow">
              <span>📬 GET IN TOUCH</span>
            </div>
            <h2 className="enq-title">
              Let's Build Something<br />
              <span className="enq-title-red">Extraordinary</span> Together
            </h2>
            <p className="enq-desc">
              Have a project in mind? Share your requirements and one of our senior
              engineers will reach out within 24 hours with a tailored consultation.
            </p>

            <div className="enq-contacts">
              {contactInfo.map((c, i) => (
                <div className="enq-contact-item" key={i}>
                  <span className="enq-contact-icon">{c.icon}</span>
                  <div>
                    <div className="enq-contact-label">{c.label}</div>
                    <div className="enq-contact-value">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="enq-promises">
              {["Free Consultation", "24hr Response", "No Commitment", "Expert Engineers"].map((p) => (
                <span className="enq-promise" key={p}>✓ {p}</span>
              ))}
            </div>
          </div>

          {/* ── Right (Form) ── */}
          <div className="enq-form-card">
            <div className="enq-form-header">
              <h3 className="enq-form-title">Send Us Your Enquiry</h3>
              <p className="enq-form-sub">All fields marked are required. We'll respond within 24 hours.</p>
            </div>

            <form className="enq-form-grid" onSubmit={handleSubmit} noValidate>
              <div className="enq-field">
                <label>First Name</label>
                <input className="enq-input" type="text" name="firstName"
                  placeholder="e.g. Rajesh" value={formData.firstName}
                  onChange={handleChange} required />
              </div>
              <div className="enq-field">
                <label>Last Name</label>
                <input className="enq-input" type="text" name="lastName"
                  placeholder="e.g. Sharma" value={formData.lastName}
                  onChange={handleChange} required />
              </div>
              <div className="enq-field">
                <label>Email Address</label>
                <input className="enq-input" type="email" name="email"
                  placeholder="your@email.com" value={formData.email}
                  onChange={handleChange} required />
              </div>
              <div className="enq-field">
                <label>Phone Number</label>
                <input className="enq-input" type="tel" name="phone"
                  placeholder="+91 72766 51565" value={formData.phone}
                  onChange={handleChange} required />
              </div>

              <div className="enq-field full">
                <label>Service Required</label>
                <select className="enq-select" name="service"
                  value={formData.service} onChange={handleChange} required>
                  <option value="" disabled>Select a service...</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="enq-field full">
                <label>Project Details</label>
                <textarea className="enq-textarea" name="message"
                  placeholder="Describe your project — location, scale, timeline, and any specific requirements..."
                  value={formData.message} onChange={handleChange} required />
              </div>

              {submitStatus === "success" && (
                <div className="enq-alert success">
                  <span>✅</span>
                  <span>Thank you! Your enquiry has been submitted successfully. Our team will contact you within 24 hours.</span>
                </div>
              )}
              {submitStatus === "error" && (
                <div className="enq-alert error">
                  <span>⚠️</span>
                  <span>Something went wrong. Please try again or call us directly.</span>
                </div>
              )}
              {submitStatus === "unauthorized" && (
                <div className="enq-alert warning">
                  <span>🔑</span>
                  <span>Please login first to send an enquiry.</span>
                </div>
              )}

              <button type="submit" className="enq-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><span className="enq-spinner" /> Sending Enquiry...</>
                ) : (
                  <>Send Enquiry →</>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default EnquirySection;
