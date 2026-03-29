import React from "react";
import "./TempRing.css";

const TempRing = ({ temperature = 75 }) => {
  const maxTemp = 100;

  const radius = 53.5;
  const circumference = 2 * Math.PI * radius;

  const percent = temperature / maxTemp;
  const offset = circumference * (1 - percent);

  return (
    <div className="temp-ring">
      <svg viewBox="0 0 125 125" width="100%" height="100%">
        <defs>
          <linearGradient
            id="tempGradient"
            gradientUnits="userSpaceOnUse"
            x1="62.5"
            y1="9"
            x2="62.5"
            y2="116"
          >
            <stop offset="0%" stopColor="#16C0CC" />
            <stop offset="100%" stopColor="#41DF82" />
          </linearGradient>
        </defs>

        <circle className="bg" cx="62.5" cy="62.5" r={radius} />

        <circle
          className="progress"
          cx="62.5"
          cy="62.5"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="temp-text">
        <span>매치온도</span>
        <strong>{temperature}°C</strong>
      </div>
    </div>
  );
};

export default TempRing;
