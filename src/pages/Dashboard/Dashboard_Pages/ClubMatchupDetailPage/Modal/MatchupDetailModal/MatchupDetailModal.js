import { useState, useEffect } from "react";
import "./MatchupDetailModal.css";
import closeIcon from "../../../../../../assets/close.svg";

const MatchupDetailModal = ({ onClose, type, matchPostId, matchType }) => {
  const [detail, setDetail] = useState(null);
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_HOST_URL}/api/matchRequest/receive/detail/${matchPostId}`,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          },
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        console.log(matchPostId);
        setDetail(data);
      } catch (e) {
        console.error("detail load fail", e);
      }
    };

    if (matchPostId) fetchDetail();
  }, [matchPostId, matchType, type]);

  const formatTime = (time) => {
    if (!time) return "";

    return time.slice(0, 5);
  };
  return (
    <>
      <div className="matchup-detail-modal-backdrop" onClick={onClose}>
        <div
          className="matchup-detail-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={closeIcon}
            alt="close"
            className="matchup-cancel-modal-close"
            onClick={onClose}
          />
          <div className="matchup-detail-modal-main">
            <span className="matchup-detail-modal-header">세부 정보</span>
            <div className="matchup-detail-modal-body">
              <div className="matchup-detail-modal-body-time">
                <span>신청</span>
                <div>
                  <input value={formatTime(detail?.startTime)} readOnly />
                  <span>~</span>
                  <input value={formatTime(detail?.endTime)} readOnly />
                </div>
              </div>
              <div className="matchup-detail-modal-body-phone">
                <span>전화번호</span>
                <input value={detail?.phone || ""} readOnly />
              </div>
              <div className="matchup-detail-modal-body-place">
                <span>장소</span>
                <input value={detail?.location || ""} readOnly />
              </div>
              <div className="matchup-detail-modal-body-map">ㅁㄴㅇ</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchupDetailModal;
