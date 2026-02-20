import { useState, useEffect, useRef } from "react";
import "./LandingPage.css";

const LandingPage = () => {

    const [current, setCurrent] = useState(0);
    const isScrolling = useRef(false);

    const sections = [
        <div className="first-section">
            <span></span>
        </div>,
        "section2",
        "section3",
        "section4",
    ];

    useEffect(() => {

        const handleWheel = (e) => {

            if (isScrolling.current) return;

            isScrolling.current = true;

            if (e.deltaY > 0) {
                setCurrent(prev =>
                    Math.min(prev + 1, sections.length - 1)
                );
            } else {
                setCurrent(prev =>
                    Math.max(prev - 1, 0)
                );
            }

            setTimeout(() => {
                isScrolling.current = false;
            }, 800);

        };

        window.addEventListener("wheel", handleWheel);

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };

    }, []);

    return (
        <div className="landing-container">

            {sections.map((section, index) => (
                <div
                    key={index}
                    className={`landing-section ${
                        current === index ? "active" : ""
                    }`}
                >
                    <h1>{section}</h1>
                </div>
            ))}

        </div>
    );

};

export default LandingPage;
