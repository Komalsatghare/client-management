function HeroSection() {

  const handleViewProjects = () => {
    console.log("View Projects clicked");
  };

  const handleGetQuote = () => {
    console.log("Get a Quote clicked");
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

            <button className="secondary-btn" onClick={handleGetQuote}>
              contact us
            </button>
          </div>

        </div>
      </section>
    </>
  );
}

export default HeroSection;
