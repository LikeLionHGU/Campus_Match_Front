import { useState, useEffect } from "react";
import "./AddCalenderModal.css";
import closeIcon from "../../../../../assets/close.svg";

const AddCalenderModal = ({ onClose, date, clubId }) => {

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  // 날짜 들어오면 자동 세팅
  useEffect(() => {
    if (date) {
      setStartDate(date);
      setEndDate(date);
    }
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 제목 validation
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
      endTime
    };
    const example =1;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        throw new Error("일정 저장 실패");
      }

      alert("일정이 저장되었습니다.");
      onClose();

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
            {/* 제목 */}
            <div className="add-calender-modal-detail-name">
              <span>이름</span>

              <input
                type="text"
                value={title}
                placeholder={
                  titleError
                    ? "제목을 입력해주세요."
                    : ""
                }
                className={titleError ? "input-error" : ""}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError("");
                }}
              />
            </div>

            {/* 시작 */}
            <div className="add-calender-modal-detail-start">
              <span>시작</span>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            {/* 종료 */}
            <div className="add-calender-modal-detail-end">
              <span>종료</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
