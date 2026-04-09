import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ServicesSection from "../Home/ServicesSection";

function Services() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <div style={{ flex: 1 }}>
                <ServicesSection />
            </div>
            <Footer />
        </div>
    );
}

export default Services;
