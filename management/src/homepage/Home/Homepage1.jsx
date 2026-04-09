import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import Navbar from "../Navbar";
import HeroSection from "./HeroSection";
import WhyChooseUs from "./WhyChooseUs";
import Footer from "../Footer";
import StructuralSolutions from "./StructuralSolutions";
import TestiMonialsSection from "./TestiMonialsSection";
import EnquirySection from "./EnquirySection";

function Homepage1() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#enquiry-section") {
      const element = document.getElementById("enquiry-section");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }, [location]);

  return (
    <div className="homepage">
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <StructuralSolutions />
      <TestiMonialsSection />
      <EnquirySection />
      <Footer />
    </div>
  );
}

export default Homepage1;

