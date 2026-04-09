import Navbar from "../Navbar";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import WhyChooseUs from "./WhyChooseUs";
import LatestWorkSection from "./LatestWorkSection";
import Footer from "../Footer";
import StructuralSolutions from "./StructuralSolutions";
// import TestiMonialsSection from "./TestiMonialsSection";
// import EnquirySection from "./EnquirySection";

function Homepage1() {
  return (
    <div className="homepage">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WhyChooseUs />
      < LatestWorkSection />
      {/* <StructuralSolutions /> */}
      {/* <TestiMonialsSection /> */}
      {/* <EnquirySection /> */}
      <Footer />
    </div>
  );
}

export default Homepage1;


