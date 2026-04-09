import React, { useState } from "react";

function TestimonialsSection() {
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [testimonials, setTestimonials] = useState([
    {
      name: "Louise",
      text: "Extremely happy with the service and workmanship. The team delivered on time with outstanding quality."
    },
    {
      name: "Jamie",
      text: "Professional, reliable, and highly skilled. The project exceeded expectations from start to finish."
    },
    {
      name: "Bianca",
      text: "Fantastic job and great communication throughout. Would absolutely recommend again."
    }
  ]);

  const [newName, setNewName] = useState("");
  const [newFeedback, setNewFeedback] = useState("");

  const handleSubmit = () => {
    if (!newName.trim() || !newFeedback.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const newEntry = {
      name: newName,
      text: newFeedback
    };

    setTestimonials([...testimonials, newEntry]);

    setNewName("");
    setNewFeedback("");
    setShowModal(false);
    setShowAll(true); // automatically show all so user sees their feedback
  };

  const visibleTestimonials = showAll
    ? testimonials
    : testimonials.slice(0, 3);

  return (
    <>
      <style>
        {`
          .testimonials {
            padding: 90px 48px;
            background-color: #f5f5f5;
            text-align: center;
            font-family: "Segoe UI", sans-serif;
          }

          .testimonials-subtitle {
            color: #d62b1b;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 10px;
          }

          .testimonials-title {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 60px;
          }

          .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
          }

          .testimonial-card {
            background: #fff;
            padding: 30px;
            border-radius: 14px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
            transition: 0.3s;
          }

          .testimonial-card:hover {
            transform: translateY(-6px);
          }

          .quote-icon {
            font-size: 40px;
            color: #e0e0e0;
          }

          .stars {
            color: #d62b1b;
            margin: 15px 0;
          }

          .testimonial-text {
            font-size: 15px;
            color: #555;
            margin-bottom: 15px;
          }

          .testimonial-name {
            font-weight: bold;
          }

          .btn-group {
            display: flex;
            justify-content: center;
            gap: 20px;
          }

          .primary-btn {
            background: #d62b1b;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }

          .secondary-btn {
            border: 2px solid #d62b1b;
            background: transparent;
            color: #d62b1b;
            padding: 12px 30px;
            border-radius: 8px;
            cursor: pointer;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .modal {
            background: white;
            padding: 30px;
            border-radius: 10px;
            width: 90%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .modal input,
          .modal textarea {
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #ccc;
          }

          .modal textarea {
            min-height: 100px;
            resize: none;
          }

          .modal-buttons {
            display: flex;
            justify-content: space-between;
          }
        `}
      </style>

      <section className="testimonials">
        <p className="testimonials-subtitle">TESTIMONIALS</p>
        <h2 className="testimonials-title">
          What Our Customers Say About Us
        </h2>

        <div className="testimonials-grid">
          {visibleTestimonials.map((item, index) => (
            <div className="testimonial-card" key={index}>
              <div className="quote-icon">“</div>
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">{item.text}</p>
              <div className="testimonial-name">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="btn-group">
          <button
            className="secondary-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "See Less" : "See More"}
          </button>

          <button
            className="primary-btn"
            onClick={() => setShowModal(true)}
          >
            Leave Feedback
          </button>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Leave Your Feedback</h3>
              <input
                type="text"
                placeholder="Your Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <textarea
                placeholder="Write your feedback here..."
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
              />
              <div className="modal-buttons">
                <button onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default TestimonialsSection;
