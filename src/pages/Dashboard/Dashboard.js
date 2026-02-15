import "./Dashboard.css";
import "./Record/Club-record.css";
import BadgeModal from "./Badge/BadgeModal";
import TempRing from "./Temperture/TempRing";
import empty_badge from "../../assets/empty_badge.png";
import { useState } from "react";
import Calender from "./Calendaer/Calender";
import Matchup from "./Matchup/Matchup";
import Gallery from "./Gallery/Gallery"
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBar/SideBar";

const Dashboard = () => {
    const [openModal, setOpenModal] = useState(null);
    const navigate = useNavigate();
    
    return(
        <>
            <div className="container">
                <div className="siderbar">
                    <Sidebar />
                </div>
                <div className="dashboard-right">
                    <div className="club-intro">
                        <div className="club-intro-left">
                            <div class="temp-ring">
                                <TempRing temperature={80}/>
                            </div>
                        </div>
                        <div className="club-intro-right">
                            <span>
                                동아리 소개
                            </span>
                            <p>
                                우리는 멋쟁이 사자처럼 달려나가 상대를 물어뜯는 축구 동아리 입니다. 우리는 멋쟁이 사자처럼 달려나가 상대를 물어뜯는 축구 동아리 입니다. 우리는 멋쟁이 
                            </p>
                        </div>
                    </div>
                    <div className="club-record" onClick={() => navigate("/dashboard/record")}>
                        <div className="club-record-top">
                            <span>매치업 히스토리</span>
                        </div>
                        <div className="club-record-bottom">
                            <div className="total-record">
                                <span className="count-title">누적 교류 수</span>
                                <span className="count">10</span>
                            </div>
                            <div className="detail-record">
                                <div className="win">
                                    <span>승</span>
                                    <p>5</p>
                                </div>
                                <div className="draw">
                                    <span>무</span>
                                    <p>2</p>
                                </div>
                                <div className="lose">
                                    <span>패</span>
                                    <p>3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="club-badge" onClick={() => setOpenModal("badge")}>
                        <div className="badge-frame">
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                
                            </div>
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                
                            </div>
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                
                            </div>
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                
                            </div>
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                
                            </div>
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className="club-matchup" >
                        <Matchup/>
                    </div>
                    <div className="club-calender" onClick={() => navigate("/dashboard/calender")}>
                        <Calender/>
                    </div>
                    <div className="club-gallery" onClick={() => navigate("/dashboard/gallery")}>
                        <Gallery/>
                    </div>
                </div>
            </div>
            {openModal === "badge" && (
            <BadgeModal onClose={() => setOpenModal(null)} />
            )}
        </>
        

        
    );

    
}

export default Dashboard;