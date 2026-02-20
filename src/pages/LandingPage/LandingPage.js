import { useEffect, useRef } from "react";
import Footer from "../../components/footer/Footer";
import "./LandingPage.css";

import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";

const LandingPage = () => {
  const sectionsRef = useRef([]);

  const sections = [Section1, Section2, Section3, Section4];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          } else {
            entry.target.classList.remove("active");
          }
        });
      },
      {
        threshold: 0.4,
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-wrapper">
      {sections.map((SectionComponent, i) => (
        <section
          key={i}
          ref={(el) => (sectionsRef.current[i] = el)}
          className="landing-section"
        >
          <SectionComponent />

          {i === sections.length - 1 && <Footer />}
        </section>
      ))}
    </div>
  );
};

export default LandingPage;