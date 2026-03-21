import React, { useState, useEffect, useRef } from "react";
import "./FinishMatchupDetailModal.css";
import closeIcon from "../../assets/close.svg";

const FinishMatchupDetailModal = ({ match, onClose }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        const response = await fetch(
          `${import.meta.env.VITE_HOST_URL}/api/matchPost/finish/${match.matchPostId}`,
          {
            method: "GET",
            headers: {
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

  useEffect(() => {
    if (!detailData || !mapRef.current) return;
    if (!window.kakao || !window.kakao.maps) return;

    const locationName = detailData.location || match.location;
    if (!locationName) return;

    window.kakao.maps.load(() => {
      const kakao = window.kakao;

      const container = mapRef.current;
      const options = {
        center: new kakao.maps.LatLng(36.019, 129.3435),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);

      const places = new kakao.maps.services.Places();
      places.keywordSearch(locationName, (data, status) => {
        if (status === kakao.maps.services.Status.OK && data.length > 0) {
          const place = data[0];
          const latlng = new kakao.maps.LatLng(place.y, place.x);

          map.setCenter(latlng);

          const marker = new kakao.maps.Marker({
            map: map,
            position: latlng,
          });

          const infowindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;white-space:nowrap;">${place.place_name}</div>`,
          });
          infowindow.open(map, marker);
        }
      });
    });
  }, [detailData, match]);

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={closeIcon}
          alt="close"
          className="detail-modal-close"
          onClick={onClose}
        />
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
              <div ref={mapRef} className="map-embed" />
            </div>
            <div className="detail-content-section">
              <span className="detail-content-label">상세 내용</span>
              <div className="detail-content-box">
                {detailData.content ||
                  detailData.detail ||
                  "상세 내용이 없습니다."}
              </div>
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
