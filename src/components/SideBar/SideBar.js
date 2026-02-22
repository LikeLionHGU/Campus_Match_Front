import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "../../assets/logout_gray.svg";
import DefaultClubIcon from "../../assets/Main_Icon_Gray.svg";
import "./SideBar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clubInfo, setClubInfo] = useState(null);

  useEffect(() => {
    const fetchClubSidebarInfo = async () => {
      try {
        const clubId = localStorage.getItem("clubId");
        const token = localStorage.getItem("Authorization");

        if (!clubId) return;

        const response = await fetch(
          `${process.env.REACT_APP_HOST_URL}/api/club/setting/${clubId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              Authorization: token || "",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          const logoUrl = data.imageUrl;

          setClubInfo({
            name: data.clubName,
            logo: logoUrl || DefaultClubIcon,
          });
        }
      } catch (error) {
        console.error("에러:", error);
      }
    };

    fetchClubSidebarInfo();
  }, []);

  const getActiveSection = () => {
    const path = location.pathname;

    if (path.startsWith("/dashboard")) return "dashboard";
    if (path.startsWith("/club-board")) return "club";
    if (path.startsWith("/matchup-board")) return "match";
    if (path.startsWith("/finish-matchup")) return "finish";

    return "";
  };

  const activeSection = getActiveSection();

  return (
    <div className="sidebar-main">
      <div className="sidebar-top">
        {clubInfo && (
          <>
            <img
              className="sidebar-top-logo"
              src={clubInfo.logo}
              alt="club-logo"
            />
            <span className="sidebar-top-name">{clubInfo.name}</span>
            <div
              className="sidebar-top-logout"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              style={{ cursor: "pointer" }}
            >
              <span>로그아웃</span>
              <img src={LogoutIcon} alt="logout" />
            </div>
          </>
        )}
      </div>
      <div className="sidebar-bottom">
        <div
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          대시보드
        </div>

        <div
          className={activeSection === "match" ? "active" : ""}
          onClick={() => navigate("/matchup-board")}
        >
          매치업 게시판
        </div>

        <div
          className={activeSection === "club" ? "active" : ""}
          onClick={() => navigate("/club-board")}
        >
          동아리 검색
        </div>

        <div
          className={activeSection === "finish" ? "active" : ""}
          onClick={() => navigate("/finish-matchup")}
        >
          종료된 매치업
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
