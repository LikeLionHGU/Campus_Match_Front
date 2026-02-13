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
      <svg width="125" height="125">

        <defs>
          <linearGradient
            id="tempGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#16C0CC" />
            <stop offset="100%" stopColor="#41DF82" />
          </linearGradient>
        </defs>

        <circle
          className="bg"
          cx="62.5"
          cy="62.5"
          r={radius}
        />

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
