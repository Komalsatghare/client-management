import React from "react";

function Hero() {
  const containerStyle = {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headerStyle = {
    fontSize: "2rem",
    textAlign: "center",
    margin: "80px 0 50px 0",
    lineHeight: "1.4",
    fontWeight: "bold",
    color: "#222",
  };

  const contentRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    borderTop: "1px solid #ccc",
    color: "#555",
    fontSize: "1.2em",
    lineHeight: "1.8",
    marginBottom: "80px",
  };

  const columnStyle = {
    flex: "1 1 45%",
    minWidth: "300px",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#007bff",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div>
        <h1 style={headerStyle}>
          We pioneered the discount broking model in India
          <br />
          Now, we are breaking ground with our technology.
        </h1>
      </div>

      {/* Content */}
      <div style={contentRowStyle}>
        {/* Left Column */}
        <div style={columnStyle}>
          <p>
           We began operations on 15th August 2010 with a mission to remove all barriers in the construction industry — whether in terms of cost, efficiency, or project management. Our company was founded with the vision of redefining how civil engineering projects are planned, designed, and executed across India.

Over the years, our innovative approach, in-house expertise, and use of cutting-edge construction technologies have positioned us as a leader in residential, commercial, and infrastructure projects. Every project is delivered with a focus on safety, quality, and sustainability.

Today, we have successfully completed over 500+ projects nationwide, ranging from multi-story complexes and bridges to industrial facilities, consistently setting new benchmarks for efficiency, design, and engineering excellence.
          </p>
        
        </div>

        {/* Right Column */}
        <div style={columnStyle}>
          <p>
            In addition, we run a number of popular open online educational and
            community initiatives to empower retail traders and investors.
          </p>
          <p>
            <a href="#" style={linkStyle}>
              Rainmatter
            </a>
            , our fintech fund and incubator, has invested in several fintech
            startups with the goal of growing the Indian capital markets.
          </p>
          <p>
            And yet, we are always up to something new every day. Catch up on
            the latest updates on our blog or see what the media is saying about
            us.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
