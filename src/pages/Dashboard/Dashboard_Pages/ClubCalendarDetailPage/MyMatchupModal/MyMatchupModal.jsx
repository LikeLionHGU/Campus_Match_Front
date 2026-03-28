import { useState, useEffect, useRef } from "react";
import "./MyMatchupModal.css";
import closeIcon from "../../../../../assets/close.svg";



const MyMatchupModal = ({
    onClose,
    clubId,
    matchPostId,   
}) => {

    const [detail, setDetail] = useState(null);

    
  const mapRef = useRef(null);


  useEffect(() => {

    const fetchDetail = async () => {

      try {

        const url = `${import.meta.env.VITE_HOST_URL}/api/matchPost/schedule/detail/${clubId}?matchPostId=${matchPostId}`;
        
        

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
        className="my-matchup-modal-backdrop"
        onClick={onClose}
        >

        <div
            className="my-matchup-modal"
            onClick={(e) => e.stopPropagation()}
        >

            <img
            src={closeIcon}
            alt="close"
            className="my-matchup-modal-close"
            onClick={onClose}
            />


            <div className="my-matchup-modal-main">

            <span className="my-matchup-modal-header">
                매치 정보
            </span>


            <div className="my-matchup-modal-body">


                
                

                
                <div className="my-matchup-modal-body-phone">

                <span>종목</span>

                <input
                    value={detail?.sportCategory || ""}
                    readOnly
                />

                </div>

                <div className="my-matchup-modal-body-phone">

                <span>동아리/대학</span>

                <input
                    value={`${detail?.clubName}/${detail?.university}` || ""}
                    readOnly
                />

                </div>

                <div className="my-matchup-modal-body-date">
                    <span>매치 날짜</span>
                    <input
                        value={detail?.matchDate}
                        readOnly
                    />
                </div>

                <div className="my-matchup-modal-body-time">

                <span>매치 시간</span>

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


                <div className="my-matchup-modal-body-place">

                <span>장소</span>

                <input
                    value={detail?.location || ""}
                    readOnly
                />

                </div>


                <div className="my-matchup-modal-body-map">

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
            <div className="my-matchup-modal-bottom">
                <button
                        className="my-matchup-bottom-button"
                        onClick={()=>onClose()}
                >
                    확인
                </button>
            </div>

            </div>

        </div>

        </div>
    </>
  );

};

export default MyMatchupModal;