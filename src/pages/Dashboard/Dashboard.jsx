import "./Dashboard.css";
import "./Record/Club-record.css";
import BadgeModal from "./Badge/BadgeModal";
import TempRing from "./Temperture/TempRing";
import ClubIntroModal from "./ClubIntro/ClubIntroModal";
import empty_badge from "../../assets/empty_badge.png";
import { useState, useEffect, useCallback } from "react";
import Calendar from "./Calendar/Calendar";
import Matchup from "./Matchup/Matchup";
import Gallery from "./Gallery/Gallery";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/SideBar/SideBar";
import LeftArrow from "../../assets/arrow_left.svg";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [badges, setBadges] = useState([]);
  const navigate = useNavigate();

  const { clubId: paramClubId } = useParams();

  const clubId = paramClubId || localStorage.getItem("clubId");
  const isMyDashboard = !paramClubId;

  const fetchClubDashboard = useCallback(async () => {
    if (!clubId) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/club/dashboard/${clubId}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("Authorization"),
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("dashboard load fail");

      const data = await res.json();
      setDashboardData(data);
    } catch (e) {
      console.error(e);
    }
  }, [clubId]);

  useEffect(() => {
    fetchClubDashboard();
  }, [fetchClubDashboard]);

  const fetchBadges = useCallback(async () => {
    if (!clubId) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/badge/${clubId}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        },
      );
      if (!res.ok) throw new Error("badge load fail");
      const data = await res.json();
      setBadges(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  }, [clubId]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return (
    <>
      <div className="container">
        <div className="siderbar">
          <Sidebar />
        </div>
        <div className="dashboard-right">
          {!isMyDashboard && (
            <div className="dashboard_back"
              onClick={() => navigate(-1)}
            >
              <img
                src={LeftArrow}
                alt="left_arrow"
                className="dashboard-back-button"
                
              />
              
              <span>동아리 게시판</span>
            </div>
    
          )}
          <div
            className="club-intro"
            onClick={() => setOpenModal("intro")}
            style={{ cursor: "pointer" }}
          >
            <div className="club-intro-left">
              <div className="temp-ring">
                <TempRing temperature={dashboardData?.mannerScore || 0} />
              </div>
            </div>
            <div className="club-intro-right">
              <span>{dashboardData?.clubName || ""}</span>
              <p>
                {dashboardData?.description || "동아리 소개를 작성해주세요."}
              </p>
            </div>
          </div>
          <div
            className={`club-record ${!isMyDashboard ? "disabled-section" : ""}`}
            onClick={() => {
              if (!isMyDashboard) return;
              navigate("/dashboard/record");
            }}
          >
            <div className="club-record-top">
              <span>매치업 히스토리</span>
            </div>
            <div className="club-record-bottom">
              <div className="total-record">
                <span className="count-title">누적 교류 수</span>
                <span className="count">
                  {Math.max(0, dashboardData?.totalMatches ?? 0)}
                </span>
              </div>
              <div className="detail-record">
                <div className="win">
                  <span>승</span>
                  <p>{Math.max(0, dashboardData?.totalWins ?? 0)}</p>
                </div>
                <div className="draw">
                  <span>무</span>
                  <p>{Math.max(0, dashboardData?.totalDraws ?? 0)}</p>
                </div>
                <div className="lose">
                  <span>패</span>
                  <p>{Math.max(0, dashboardData?.totalLosses ?? 0)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="club-badge" onClick={() => setOpenModal("badge")}>
            <div className="badge-frame">
              {(() => {
                const MAX_BADGES = 6;
                const slots = [...badges];
                while (slots.length < MAX_BADGES) slots.push(null);
                return slots.slice(0, MAX_BADGES).map((badge, i) => (
                  <div key={i} className="badge-item">
                    <img
                      src={badge?.imageUrl || empty_badge}
                      alt={badge?.title || "empty"}
                    />
                    <span className="badge-tooltip">
                      {badge ? badge.title : "아직 배지가 없습니다"}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
          <div
            className={`club-matchup ${!isMyDashboard ? "disabled-section" : ""}`}
          >
            <Matchup
              upcomingList={dashboardData?.upcomingResDtoList || []}
              ongoingList={dashboardData?.ongoingResDtoList || []}
              receiveList={dashboardData?.receiveResDtoList || []}
              sendList={dashboardData?.sendResDtoList || []}
            />
          </div>
          <div
            className="club-calendar"
            onClick={() => {
              if (isMyDashboard) {
                navigate("/dashboard/calendar");
              } else {
                navigate(`/club-board/dashboard/${clubId}/calendar`);
              }
            }}
          >
            <Calendar
              schedules={dashboardData?.scheduleResDtoList || []}
              upcomingMatches={dashboardData?.upcomingResDtoList || []}
              ongoingMatches={dashboardData?.ongoingResDtoList || []}
              matchRequests={dashboardData?.matchResDtoList || []}
            />
          </div>
          <div
            className="club-gallery"
            onClick={() => {
              if (!isMyDashboard) return;

              navigate("/dashboard/gallery");
            }}
            style={{ cursor: isMyDashboard ? "pointer" : "default" }}
          >
            <Gallery galleryList={dashboardData?.galleryResDtoList || []} />
          </div>
        </div>
      </div>
      {openModal === "badge" && (
        <BadgeModal onClose={() => setOpenModal(null)} />
      )}
      {openModal === "intro" && (
        <ClubIntroModal
          clubId={clubId}
          onClose={() => setOpenModal(null)}
          onUpdate={fetchClubDashboard}
        />
      )}
    </>
  );
};

export default Dashboard;
