import { API_BASE_URL } from "../../config";
import React, { useState } from "react";
import bgImage from "../../assets/construction-bg.png";

function EnquirySection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("${API_BASE_URL}/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage("Thank you! Your enquiry has been submitted. We'll be in touch soon.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          service: "",
          message: ""
        });
      } else {
        setSubmitMessage(`Failed to submit: ${data.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      setSubmitMessage("An error occurred while submitting your inquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <style>
        {`
          .enquiry-section {
            position: relative;
            background: url(${bgImage}) center/cover no-repeat;
            padding: 120px 60px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            min-height: 600px;
          }

          .overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to right,
              rgba(0,0,0,0.7),
              rgba(0,0,0,0.5),
              rgba(0,0,0,0.3)
            );
          }

          .enquiry-content {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 550px;
            color: white;
          }

          .enquiry-subtitle {
            letter-spacing: 2px;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 10px;
          }

          .enquiry-title {
            font-size: 38px;
            font-weight: 800;
            margin-bottom: 30px;
            line-height: 1.2;
          }

          .enquiry-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }

          .enquiry-form input,
          .enquiry-form select,
          .enquiry-form textarea {
            padding: 12px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            color: #333;
            outline: none;
          }

          .enquiry-form textarea {
            grid-column: span 2;
            min-height: 120px;
            resize: none;
          }

          .enquiry-form select {
            grid-column: span 2;
          }

          .submit-btn {
            grid-column: span 2;
            background: #e31c1c;
            color: white;
            padding: 14px;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
          }

          .submit-btn:hover {
            background: #b91515;
          }

          @media (max-width: 768px) {
            .enquiry-section {
              padding: 80px 20px;
              justify-content: center;
            }

            .enquiry-form {
              grid-template-columns: 1fr;
            }

            .enquiry-form textarea,
            .submit-btn,
            .enquiry-form select {
              grid-column: span 1;
            }

            .enquiry-title {
              font-size: 28px;
            }
          }
        `}
      </style>

      <section className="enquiry-section">
        <div className="overlay"></div>

        <div className="enquiry-content">
          <p className="enquiry-subtitle">ENQUIRY FORM</p>
          <h2 className="enquiry-title">
            Tell Us About Your Construction Project!
          </h2>

          <form className="enquiry-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Choose Service</option>
              <option value="Residential Construction">Residential Construction</option>
              <option value="Commercial Construction">Commercial Construction</option>
              <option value="Renovation">Renovation</option>
              <option value="Electrical Work">Electrical Work</option>
            </select>

            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "SENDING..." : "SEND"}
            </button>

            {submitMessage && (
              <div style={{
                gridColumn: "span 2",
                padding: "10px",
                marginTop: "10px",
                backgroundColor: submitMessage.includes("Thank you") ? "rgba(40, 167, 69, 0.9)" : "rgba(220, 53, 69, 0.9)",
                color: "white",
                borderRadius: "4px",
                textAlign: "center"
              }}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

export default EnquirySection;


