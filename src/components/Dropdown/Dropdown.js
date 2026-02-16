import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

export default function CustomSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setIsOpen(false);
  };

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="club-field">
      <label className="club-label">
        {label}
        {required && <span className="club-req">*</span>}
      </label>
      <div className="custom-select" ref={ref}>
        <div
          className={`custom-select-trigger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selected ? selected.label : "선택하세요"}</span>
          <svg
            className={`select-arrow ${isOpen ? "open" : ""}`}
            width="12"
            height="8"
            viewBox="0 0 12 8"
          >
            <path
              fill="#9e9e9e"
              d="M1.41 0L6 4.59L10.59 0L12 1.41l-6 6l-6-6z"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="custom-select-dropdown">
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`custom-select-option ${
                  opt.value === value ? "selected" : ""
                }`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
