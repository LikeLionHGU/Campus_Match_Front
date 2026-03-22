import { useState, useEffect } from "react";
import "./EditCalenderModal.css";
import closeIcon from "../../../../../assets/close.svg";

const EditCalenderModal = ({ onClose, onSuccess, onDelete, scheduleId }) => {

  const [title, setTitle] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.slice(0, 10);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "00:00";
    return timeStr.slice(0, 5);
  };

  useEffect(() => {
    if (!scheduleId) return;

    const fetchScheduleDetail = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_HOST_URL}/api/schedule/detail/${scheduleId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": localStorage.getItem("Authorization"),
            },
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        setTitle(data.title || "");
        setStartDate(formatDate(data.startDate));
        setEndDate(formatDate(data.endDate));
        setStartTime(formatTime(data.startTime));
        setEndTime(formatTime(data.endTime));

      } catch (err) {
        console.error(err);
        alert("일정을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleDetail();
  }, [scheduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/schedule/${scheduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("Authorization"),
          },
          body: JSON.stringify({
            title,
            startDate,
            endDate,
            startTime,
            endTime,
          }),
        }
      );

      if (!res.ok) throw new Error();

      onSuccess();

    } catch (err) {
      console.error(err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/schedule/${scheduleId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": localStorage.getItem("Authorization"),
          },
        }
      );

      if (!res.ok) throw new Error();

      onDelete();

    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return null;

  return (
    <div className="edit-calender-modal-backdrop" onClick={onClose}>
      <div
        className="edit-calender-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={closeIcon}
          alt="close"
          className="edit-calender-modal-close"
          onClick={onClose}
        />

        <div className="edit-calender-modal-main">
          <div className="edit-calender-modal-title">
            <span>일정 수정</span>
          </div>

          <form
            className="edit-calender-modal-detail"
            onSubmit={handleSubmit}
          >

            <div className="edit-calender-modal-detail-name">
              <span>이름</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="edit-calender-modal-detail-start">
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

            <div className="edit-calender-modal-detail-end">
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

            <div className="edit-calender-modal-buttons">
              <button
                type="button"
                className="edit-calender-delete-button"
                onClick={handleDelete}
              >
                삭제
              </button>

              <button className="edit-calender-edit-button" type="submit">
                저장
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCalenderModal;
