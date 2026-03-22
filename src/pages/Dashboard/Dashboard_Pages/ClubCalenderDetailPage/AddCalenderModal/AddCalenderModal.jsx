import { useState, useEffect } from "react";
import "./AddCalenderModal.css";
import closeIcon from "../../../../../assets/close.svg";

const AddCalenderModal = ({ onClose, date, onSuccess }) => {

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
    <div className="add-calender-modal-backdrop" onClick={onClose}>
      <div
        className="add-calender-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={closeIcon}
          alt="close"
          className="add-calender-modal-close"
          onClick={onClose}
        />

        <div className="add-calender-modal-main">
          <div className="add-calender-modal-title">
            <span>일정 추가</span>
          </div>

          <form
            className="add-calender-modal-detail"
            onSubmit={handleSubmit}
          >
            <div className="add-calender-modal-detail-name">
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

            <div className="add-calender-modal-detail-start">
              <span>시작</span>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
              />

              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="add-calender-modal-detail-end">
              <span>종료</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />

              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <button type="submit">저장</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCalenderModal;
