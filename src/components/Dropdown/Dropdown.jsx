import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";
import arrowDownGray from "../../assets/arrow_down_gray.svg";

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
          className={`custom-select-trigger ${isOpen ? "open" : ""} ${selected && value ? "has-value" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={selected && value ? "" : "placeholder"}>
            {selected ? selected.label : "선택하세요"}
          </span>
          <img
            src={arrowDownGray}
            alt="arrow"
            className={`select-arrow ${isOpen ? "open" : ""}`}
          />
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
