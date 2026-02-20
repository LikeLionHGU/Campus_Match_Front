import { useEffect, useRef } from "react";
import Footer from "../../components/footer/Footer";
import "./LandingPage.css";

const LandingPage = () => {
  const sectionsRef = useRef([]);

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
        threshold: 0.4, // 40% 보이면 활성화
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-wrapper">
      {[0, 1, 2, 3].map((i) => (
        <section
          key={i}
          ref={(el) => (sectionsRef.current[i] = el)}
          className="landing-section"
        >
          <h1>Section {i + 1}</h1>

          {i === 3 && <Footer />}
        </section>
      ))}
    </div>
  );
};

export default LandingPage;