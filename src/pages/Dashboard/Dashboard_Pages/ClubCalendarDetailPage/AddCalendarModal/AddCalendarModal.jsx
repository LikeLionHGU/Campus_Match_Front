import { useState, useEffect } from "react";
import "./AddCalendarModal.css";
import closeIcon from "../../../../../assets/close.svg";

const AddCalendarModal = ({ onClose, date, onSuccess }) => {

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:50");

  useEffect(() => {
    if (date) {
      setStartDate(date);
      setEndDate(date);
    }
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("제목을 입력해주세요.");
      return;
    }

    setTitleError("");

    const body = {
      title,
      startDate,
      endDate,
      startTime,
      endTime,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/schedule`,
        {
          method: "POST",
          headers: {
            "Authorization" : localStorage.getItem("Authorization"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        throw new Error("일정 저장 실패");
      }

      onSuccess();

    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="add-calendar-modal-backdrop" onClick={onClose}>
      <div
        className="add-calendar-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={closeIcon}
          alt="close"
          className="add-calendar-modal-close"
          onClick={onClose}
        />

        <div className="add-calendar-modal-main">
          <div className="add-calendar-modal-title">
            <span>일정 추가</span>
          </div>

          <form
            className="add-calendar-modal-detail"
            onSubmit={handleSubmit}
          >
            <div className="add-calendar-modal-detail-name">
              <span>이름</span>

              <input
                type="text"
                value={title}
                placeholder={titleError ? "제목을 입력해주세요." : ""}
                className={titleError ? "input-error" : ""}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError("");
                }}
              />
            </div>

            <div className="add-calendar-modal-detail-start">
              <span>시작</span>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
              />

              <input
                type="text"
                value={startTime}
                placeholder="HH:MM"
                maxLength={5}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="add-calendar-modal-detail-end">
              <span>종료</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />

              <input
                type="text"
                value={endTime}
                placeholder="HH:MM"
                maxLength={5}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length === 5 && startTime.length === 5 && val < startTime) {
                    setEndTime(startTime);
                  } else {
                    setEndTime(val);
                  }
                }}
              />
            </div>

            <button type="submit">저장</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCalendarModal;
