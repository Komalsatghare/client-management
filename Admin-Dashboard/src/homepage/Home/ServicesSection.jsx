import React from "react";

function ServicesSection() {

  const handleServiceClick = (service) => {
    console.log(`${service} service clicked`);
  };

  return (
    <>
      <style>
        {`
          .services {
            padding: 80px 48px;
            background-color: #ffffff;
            font-family: "Segoe UI", sans-serif;
          }

          .services-header {
            text-align: center;
            margin-bottom: 60px;
          }

          .services-header h2 {
            font-size: 40px;
            font-weight: 800;
            color: #1f1f1f;
            margin-bottom: 12px;
          }

          .services-header p {
            font-size: 18px;
            color: #555;
            max-width: 700px;
            margin: auto;
            line-height: 1.6;
          }

          .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
          }

          .service-card {
            background-color: #f9f9f9;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }

          .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
          }

          .service-image img {
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .service-content {
            padding: 24px;
          }

          .service-content h3 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #1f1f1f;
          }

          .service-content p {
            font-size: 15.5px;
            color: #555;
            line-height: 1.6;
          }

          /* Centered Button */
          .services-btn-container {
            display: flex;
            justify-content: center;
            margin-top: 60px;
          }

          .services-btn {
            background-color: #d62b1b;
            color: #fff;
            padding: 14px 32px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 12px rgba(214, 43, 27, 0.4);
            transition: all 0.3s ease;
          }

          .services-btn:hover {
            background-color: #b71c1c;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(214, 43, 27, 0.6);
          }

          @media (max-width: 768px) {
            .services {
              padding: 60px 24px;
            }

            .services-header h2 {
              font-size: 32px;
            }
          }
        `}
      </style>

      <section className="services">

        {/* Section Heading */}
        <div className="services-header">
          <h2>Our Services</h2>
          <p>
            We provide end-to-end construction solutions tailored to residential,
            commercial, and renovation needs with quality and reliability.
          </p>
        </div>

        {/* Services Cards */}
        <div className="services-grid">

          {/* Residential */}
          <div
            className="service-card"
            onClick={() => handleServiceClick("Residential")}
          >
            <div className="service-image">
              <img
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
                alt="Residential Construction"
              />
            </div>
            <div className="service-content">
              <h3>Residential Construction</h3>
              <p>
                We design and build modern, durable homes that combine comfort,
                functionality, and long-lasting quality.
              </p>
            </div>
          </div>

          {/* Commercial */}
          <div
            className="service-card"
            onClick={() => handleServiceClick("Commercial")}
          >
            <div className="service-image">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
                alt="Commercial Construction"
              />
            </div>
            <div className="service-content">
              <h3>Commercial Construction</h3>
              <p>
                From offices to retail spaces, we deliver efficient commercial
                structures built to support your business growth.
              </p>
            </div>
          </div>

          {/* Renovation */}
          <div
            className="service-card"
            onClick={() => handleServiceClick("Renovation")}
          >
            <div className="service-image">
              <img
                src="https://images.unsplash.com/photo-1581092334494-7bca6c2d7b1c"
                alt="Renovation & Remodeling"
              />
            </div>
            <div className="service-content">
              <h3>Renovation & Remodeling</h3>
              <p>
                Upgrade your existing spaces with smart renovations that enhance
                aesthetics, functionality, and value.
              </p>
            </div>
          </div>

        </div>

        {/* Centered Learn More Button */}
        <div className="services-btn-container">
          <button className="services-btn">
            Learn More
          </button>
        </div>

      </section>
    </>
  );
}

export default ServicesSection;
