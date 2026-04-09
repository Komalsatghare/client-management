import React from "react";

function LatestWorkSection() {

  const handleClick = () => {
    console.log("Check All Projects clicked");
  };

  return (
    <>
      <style>
        {`
          .latest-work {
            padding: 80px 48px;
            background-color: #f8f9fa;
            font-family: "Segoe UI", sans-serif;
          }

          .latest-header {
            text-align: center;
            margin-bottom: 60px;
          }

          .latest-header h2 {
            font-size: 38px;
            font-weight: 800;
            color: #1f1f1f;
            margin-bottom: 12px;
          }

          .latest-header p {
            font-size: 18px;
            color: #555;
            max-width: 700px;
            margin: auto;
            line-height: 1.6;
          }

          .latest-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
          }

          .latest-card {
            overflow: hidden;
            border-radius: 14px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
            cursor: pointer;
          }

          .latest-card img {
            width: 100%;
            height: 230px;
            object-fit: cover;
            transition: transform 0.4s ease;
          }

          .latest-card:hover img {
            transform: scale(1.08);
          }

          .latest-btn-container {
            display: flex;
            justify-content: center;
            margin-top: 60px;
          }

          .latest-btn {
            background-color: #d62b1b;
            color: #fff;
            padding: 14px 34px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 12px rgba(214, 43, 27, 0.4);
            transition: all 0.3s ease;
          }

          .latest-btn:hover {
            background-color: #b71c1c;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(214, 43, 27, 0.6);
          }

          @media (max-width: 768px) {
            .latest-work {
              padding: 60px 24px;
            }

            .latest-header h2 {
              font-size: 30px;
            }
          }
        `}
      </style>

      <section className="latest-work">

        {/* Header */}
        <div className="latest-header">
          <h2>Our Latest Work</h2>
          <p>
            Explore some of our recent residential and commercial construction
            projects delivered with excellence and precision.
          </p>
        </div>

        {/* Grid */}
        <div className="latest-grid">
          <div className="latest-card">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c" alt="Project 1" />
          </div>
          <div className="latest-card">
            <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d" alt="Project 2" />
          </div>
          <div className="latest-card">
            <img src="https://images.unsplash.com/photo-1600573472591-ee6b68d14c68" alt="Project 3" />
          </div>
          <div className="latest-card">
            <img src="https://images.unsplash.com/photo-1501183638710-841dd1904471" alt="Project 4" />
          </div>
          <div className="latest-card">
            <img src="https://images.unsplash.com/photo-1599423300746-b62533397364" alt="Project 5" />
          </div>
          <div className="latest-card">
            <img src="https://images.unsplash.com/photo-1507089947367-19c1da9775ae" alt="Project 6" />
          </div>
        </div>

        {/* Button */}
        <div className="latest-btn-container">
          <button
            className="latest-btn"
            onClick={handleClick}
          >
            Check All Projects
          </button>
        </div>

      </section>
    </>
  );
}

export default LatestWorkSection;
