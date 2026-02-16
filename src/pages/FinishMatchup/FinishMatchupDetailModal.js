import React, { useState, useEffect } from "react";
import "./FinishMatchupDetailModal.css";

const FinishMatchupDetailModal = ({ match, onClose }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        const response = await fetch(
          `${process.env.REACT_APP_HOST_URL}/api/matchPost/finish/detail/${match.matchPostId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token || "",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setDetailData(data);
        } else {
          console.error("Failed to fetch detail");
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (match) {
      fetchDetail();
    }
  }, [match]);

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="detail-modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="detail-modal-title">세부 정보</h2>

        {loading ? (
          <div>Loading...</div>
        ) : detailData ? (
          <>
            <div className="detail-row">
              <span className="detail-label">신청</span>
              <div className="time-range-container">
                <div className="time-box">
                  {detailData.startTime || "14:00"}
                </div>
                <span>~</span>
                <div className="time-box">{detailData.endTime || "17:00"}</div>
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-label">전화번호</span>
              <div className="detail-value-box">
                {detailData.phoneNumber || "010-0000-0000"}
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-label">장소</span>
              <div className="detail-value-box">
                {detailData.location || match.location}
              </div>
            </div>

            <div className="map-placeholder">
              {/* Placeholder for Map - replaced with actual map if available */}
              <div className="map-fallback">지도 보기 (준비중)</div>
              {/* <img src="/path/to/map/image" alt="Map" className="map-img" /> */}
            </div>
          </>
        ) : (
          <div>정보를 불러올 수 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default FinishMatchupDetailModal;
