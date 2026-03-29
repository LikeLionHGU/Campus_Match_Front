import React from "react";
import "../Temperture/TempRing.css";

const ClubIntroTempRing = ({ temperature = 0 }) => {
  const maxTemp = 100;
  const clampedTemp = Math.min(100, Math.max(0, temperature));

  const radius = 53.5;
  const circumference = 2 * Math.PI * radius;

  const percent = clampedTemp / maxTemp;
  const offset = circumference * (1 - percent);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.781vw" }}>
      <div
        style={{
          fontSize: "1.042vw",
          fontWeight: "600",
          color: "#1f1f1f",
          fontFamily: "Pretendard",
        }}
      >
        매치온도
      </div>
      <div className="temp-ring">
        <svg viewBox="0 0 125 125" width="100%" height="100%">
          <defs>
            <linearGradient
              id="tempGradientClub"
              gradientUnits="userSpaceOnUse"
              x1="62.5"
              y1="9"
              x2="62.5"
              y2="116"
            >
              <stop offset="0%" stopColor="#41DF82" />
              <stop offset="100%" stopColor="#16C0CC" />
            </linearGradient>

          </defs>

          <circle className="bg" cx="62.5" cy="62.5" r={radius} />

          {clampedTemp > 0 && (
            <circle
              className="progress"
              cx="62.5"
              cy="62.5"
              r={radius}
              stroke="url(#tempGradientClub)"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          )}
        </svg>

        <div className="temp-text">
          <strong style={{ fontSize: "1.146vw", fontWeight: "600" }}>
            {clampedTemp}°C
          </strong>
        </div>
      </div>
    </div>
  );
};

export default ClubIntroTempRing;
