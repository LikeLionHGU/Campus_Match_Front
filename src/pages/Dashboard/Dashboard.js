import "./Dashboard.css";
import "./Record/Club-record.css";
import BadgeModal from "./Badge/BadgeModal";
import TempRing from "./Temperture/TempRing";
import ClubIntroModal from "./ClubIntro/ClubIntroModal";
import empty_badge from "../../assets/empty_badge.png";
import { useState, useEffect } from "react";
import Calender from "./Calendaer/Calender";
import Matchup from "./Matchup/Matchup";
import Gallery from "./Gallery/Gallery";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBar/SideBar";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  const clubId = localStorage.getItem("clubId");

  const fetchClubDashboard = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/club/dashboard/${clubId}`,
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
      console.log("Dashboard data:", data);
      setDashboardData(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchClubDashboard();
  }, []);

  return (
    <>
      <div className="container">
        <div className="siderbar">
          <Sidebar />
        </div>
        <div className="dashboard-right">
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
              <span>동아리 소개</span>
              <p>
                {dashboardData?.description || "동아리 소개를 작성해주세요."}
              </p>
            </div>
          </div>
          <div
            className="club-record"
            onClick={() => navigate("/dashboard/record")}
          >
            <div className="club-record-top">
              <span>매치업 히스토리</span>
            </div>
            <div className="club-record-bottom">
              <div className="total-record">
                <span className="count-title">누적 교류 수</span>
                <span className="count">
                  {dashboardData?.totalMatches ?? 0}
                </span>
              </div>
              <div className="detail-record">
                <div className="win">
                  <span>승</span>
                  <p>{dashboardData?.totalWins ?? 0}</p>
                </div>
                <div className="draw">
                  <span>무</span>
                  <p>{dashboardData?.totalDraws ?? 0}</p>
                </div>
                <div className="lose">
                  <span>패</span>
                  <p>{dashboardData?.totalLosses ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="club-badge" onClick={() => setOpenModal("badge")}>
            <div className="badge-frame">
              <div>
                <img src={empty_badge} alt="empty" />
              </div>
              <div>
                <img src={empty_badge} alt="empty" />
              </div>
              <div>
                <img src={empty_badge} alt="empty" />
              </div>
              <div>
                <img src={empty_badge} alt="empty" />
              </div>
              <div>
                <img src={empty_badge} alt="empty" />
              </div>
              <div>
                <img src={empty_badge} alt="empty" />
              </div>
            </div>
          </div>
          <div className="club-matchup">
            <Matchup
              upcomingList={dashboardData?.upcomingResDtoList || []}
              ongoingList={dashboardData?.ongoingResDtoList || []}
              receiveList={dashboardData?.receiveResDtoList || []}
              sendList={dashboardData?.sendResDtoList || []}
            />
          </div>
          <div
            className="club-calender"
            onClick={() => navigate("/dashboard/calender")}
          >
            <Calender />
          </div>
          <div
            className="club-gallery"
            onClick={() => navigate("/dashboard/gallery")}
          >
            <Gallery />
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
