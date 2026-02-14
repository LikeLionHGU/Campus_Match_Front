import { useState, useEffect } from "react";
import "./EditCalenderModal.css";
import closeIcon from "../../../../../assets/close.svg";

const EditCalenderModal = ({ onClose, scheduleId }) => {

  const [title, setTitle] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(true);

  /* ✅ 모달 열릴 때 일정 상세 조회 */
  useEffect(() => {
    if (!scheduleId) return;

    const fetchScheduleDetail = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_HOST_URL}/api/schedule/detail/${scheduleId}`
        );

        if (!res.ok) {
          throw new Error("일정 조회 실패");
        }

        const data = await res.json();

        setTitle(data.title);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setStartTime(data.startTime);
        setEndTime(data.endTime);

      } catch (err) {
        console.error(err);
        alert("일정을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleDetail();
  }, [scheduleId]);

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

          <form className="edit-calender-modal-detail">

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

export default EditCalenderModal;
