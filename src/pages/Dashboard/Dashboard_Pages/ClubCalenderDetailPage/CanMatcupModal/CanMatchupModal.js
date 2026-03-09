import { useState, useEffect, useRef } from "react";
import "./CanMatchupModal.css";
import closeIcon from "../../../../../assets/close.svg";
import ApplyMatchupModal2 from "./ApplyMatchupModal2";
import ApplySuccessModal from "../../../../Matchup_Board_Page/ApplySuccessModal/ApplySuccessModal";

const CanMatchupModal = ({
    onClose,
    clubId,
    matchPostId,
    onSuccess    
}) => {

    const [detail, setDetail] = useState(null);
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [applySuccessModalOpen, setApplySuccessModalOpen] = useState(false);
    const [applyStartTime, setApplyStartTime] = useState("");
    const [applyEndTime, setApplyEndTime] = useState("");
  const mapRef = useRef(null);


  useEffect(() => {

    const fetchDetail = async () => {

      try {

        const url = `${process.env.REACT_APP_HOST_URL}/api/matchPost/schedule/detail/${clubId}?matchPostId=${matchPostId}`;
        
        

        if (!url) return;

        const res = await fetch(url, {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setDetail(data);
        console.log(data);

      } catch (e) {
        console.error("CanMatchup detail load fail", e);
      }

    };

    if (matchPostId || clubId) fetchDetail();

  }, [matchPostId, clubId]);


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

        if (
          status === kakao.maps.services.Status.OK &&
          data.length > 0
        ) {

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

    const formatTimeToKorean = (time) => {
        if (!time) return "";
        let [hour, minute] = time.split(":").map(Number);
        if (hour === 24) {
            return "오후 12:00";
        }
        const period = hour < 12 ? "오전" : "오후";
        hour = hour % 12;
        if (hour === 0) hour = 12;
        return `${period} ${hour}:${String(minute).padStart(2, "0")}`;
    };



  return (

    
    <>
        <div
        className="can-matchup-modal-backdrop"
        onClick={onClose}
        >

        <div
            className="can-matchup-modal"
            onClick={(e) => e.stopPropagation()}
        >

            <img
            src={closeIcon}
            alt="close"
            className="can-matchup-modal-close"
            onClick={onClose}
            />


            <div className="can-matchup-modal-main">

            <span className="can-matchup-modal-header">
                매치 정보
            </span>


            <div className="can-matchup-modal-body">


                <div className="can-matchup-modal-body-date">
                    <span>가능 날짜</span>
                    <input
                        value={detail?.matchDate}
                        readOnly
                    />
                </div>
                <div className="can-matchup-modal-body-time">

                <span>가능 시간</span>

                <div>
                    <input
                    value={formatTimeToKorean(detail?.startTime)}
                    readOnly
                    />

                    <span>~</span>

                    <input
                    value={formatTimeToKorean(detail?.endTime)}
                    readOnly
                    />
                </div>

                </div>

                <div className="can-matchup-modal-body-time2">

                <span>신청 시간</span>

                <div>
                    <input
                    type="time"
                    value={applyStartTime}
                    onChange={(e) => setApplyStartTime(e.target.value)}
                    min={detail?.startTime||undefined}
                    max={applyEndTime||undefined}
                    />

                    <span>~</span>

                    <input
                    type="time"
                    value={applyEndTime}
                    onChange={(e) => setApplyEndTime(e.target.value)}
                    min={applyStartTime||undefined}
                    max={detail?.endTime||undefined}
                    />
                </div>

                </div>


                <div className="can-matchup-modal-body-phone">

                <span>전화번호</span>

                <input
                    value={detail?.phone || ""}
                    readOnly
                />

                </div>


                <div className="can-matchup-modal-body-place">

                <span>장소</span>

                <input
                    value={detail?.location || ""}
                    readOnly
                />

                </div>


                <div className="can-matchup-modal-body-map">

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
            <div className="can-matchup-modal-bottom">
                    <button 
                        className="can-matchup-bottom-left-button"
                        onClick={onClose}>
                    취소
                </button>
                <button
                        className="can-matchup-bottom-right-button"
                        onClick={() => {
                            
                            setApplyModalOpen(true);
                            
                        }}
                >
                    신청
                </button>
            </div>

            </div>

        </div>

        </div>
        {applyModalOpen && (
            <ApplyMatchupModal2
                matchPostId={matchPostId}
                matchDate={detail?.matchDate}

                start={applyStartTime}
                end={applyEndTime}

                onClose={() => setApplyModalOpen(false)}

                onSuccess={() => {
                setApplyModalOpen(false);
                setApplySuccessModalOpen(true);
                
                }}
            />
        )}
        {applySuccessModalOpen && (
            <ApplySuccessModal onConfirm={() => setApplySuccessModalOpen(false)} />
        )}
    </>
  );

};

export default CanMatchupModal;