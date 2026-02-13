import LogoutIcon from "../../assets/logout.svg";
import DefaultClubIcon from "../../assets/Main_Icon_Gray.svg";
import { useNavigate, useLocation } from "react-router-dom";
import "./SideBar.css";

const Sidebar = () =>{

    const navigate = useNavigate();
    const location = useLocation();

    const getActiveSection = () => {
    const path = location.pathname;

        if (path.startsWith("/dashboard")) return "dashboard";
        if (path.startsWith("/club-board")) return "club";
        if (path.startsWith("/matchup-board")) return "match";
        if (path.startsWith("/finish-matchup")) return "finish";

        return "";
    };

    const activeSection = getActiveSection();
    return(
        <>
            <div className="sidebar-main">
                <div className="sidebar-top">
                    <img className="sidebar-top-logo" src={DefaultClubIcon} alt="main-logo"  />
                    <span className="sidebar-top-name">멋쟁이 사자처럼</span>
                    <div className="sidebar-top-logout">
                        <span>로그아웃</span>    
                        <img src={LogoutIcon} alt="logout" />
                    </div>
                    
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
        </>
    );
}

export default Sidebar;