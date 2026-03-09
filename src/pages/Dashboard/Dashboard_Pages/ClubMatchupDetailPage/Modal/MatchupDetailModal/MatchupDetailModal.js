import { useState, useEffect, useRef } from "react";
import "./MatchupDetailModal.css";
import closeIcon from "../../../../../../assets/close.svg";

const MatchupDetailModal = ({
  onClose,
  type,
  matchPostId,
  matchRequestId,
  matchType,
}) => {
  const [detail, setDetail] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        let url = "";

        if (type === "receive") {
          url = `${process.env.REACT_APP_HOST_URL}/api/matchRequest/receive/${matchRequestId}`;
        } else if (type === "send") {
          url = `${process.env.REACT_APP_HOST_URL}/api/matchRequest/send/${matchRequestId}`;
        } else if (type === "ongoing") {
          url = `${process.env.REACT_APP_HOST_URL}/api/matchPost/ongoing/${matchPostId}`;
        } else if (type === "upcoming") {
          url = `${process.env.REACT_APP_HOST_URL}/api/matchPost/upcoming/${matchPostId}`;
        }

        if (!url) return;

        const res = await fetch(url, {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setDetail(data);
      } catch (e) {
        console.error("detail load fail", e);
      }
    };

    if (matchPostId || matchRequestId) fetchDetail();
  }, [matchPostId, matchRequestId, matchType, type]);

  useEffect(() => {
  if (!detail || !mapRef.current) return;
  if (!window.kakao || !window.kakao.maps) return;


  const locationName = detail.locationDetail || detail.location;
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
          content: `
            <div style="
              padding:6px 10px;
              font-size:13px;
              font-weight:600;
              white-space:nowrap;
            ">
              ${detail.location}
            </div>
          `,
        });

        infowindow.open(map, marker);
      }
    });
  });
}, [detail]);

  const formatTime = (time) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  return (
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

            <div className="matchup-detail-modal-body-map">
              <div
                ref={mapRef}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0.417vw",
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchupDetailModal;