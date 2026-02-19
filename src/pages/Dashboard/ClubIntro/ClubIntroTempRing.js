import React from "react";
import "./ClubIntroTempRing.css";

const ClubIntroTempRing = ({ temperature = 0 }) => {
  const viewBoxSize = 213;
  const center = 106.141;
  const radius = 77.8;
  const strokeWidth = 27.5;
  const circumference = 2 * Math.PI * radius;

  // Clamp temperature between 0 and 100
  const clampedTemp = Math.min(100, Math.max(0, temperature));
  const percent = clampedTemp / 100;
  const offset = circumference * (1 - percent);

  return (
    <div className="club-intro-temp-ring">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        fill="none"
      >
        <defs>
          <filter
            id="filter0_d_clubintro"
            x="0.000626564"
            y="1.62125e-05"
            width="212.28"
            height="212.28"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="7.32" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_d_clubintro"
            x="0.000626564"
            y="0.894181"
            width="212.28"
            height="211.386"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="7.32" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.145098 0 0 0 0 0.796078 0 0 0 0 0.698039 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_clubintro"
            x1="179.341"
            y1="49.41"
            x2="36.6006"
            y2="166.53"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#16C0CC" />
            <stop offset="1" stopColor="#41DF82" />
          </linearGradient>
        </defs>

        {/* Static Gray Background Ring */}
        <g filter="url(#filter0_d_clubintro)">
          <path
            d="M106.141 14.64C156.675 14.64 197.641 55.606 197.641 106.14C197.641 156.674 156.675 197.64 106.141 197.64C55.6066 197.64 14.6406 156.674 14.6406 106.14C14.6406 55.606 55.6066 14.64 106.141 14.64ZM106.141 170.19C141.514 170.19 170.191 141.514 170.191 106.14C170.191 70.7662 141.514 42.09 106.141 42.09C70.7668 42.09 42.0906 70.7662 42.0906 106.14C42.0906 141.514 70.7668 170.19 106.141 170.19Z"
            fill="#D6D6D6"
          />
        </g>

        {/* Dynamic Colored Progress Ring */}
        <g filter="url(#filter1_d_clubintro)">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#paint0_linear_clubintro)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </g>
      </svg>

      <div className="club-intro-temp-text">
        <strong>{temperature}°C</strong>
      </div>
    </div>
  );
};

export default ClubIntroTempRing;
