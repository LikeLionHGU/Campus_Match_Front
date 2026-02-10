import "./Dashboard.css";
import "./Club-record.css";
import TempRing from "./TempRing";
import empty_badge from "../../assets/empty_badge.png"

const Dashboard = () => {
    return(
        <>
            <div className="container">
                <div className="left">

                </div>
                <div className="right">
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
                                asdasdasd
                            </p>
                        </div>
                    </div>
                    <div className="club-record">
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
                    <div className="club-badge">
                        <div className="badge-frame">
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                <span>asd</span>
                            </div>
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                <span>asd</span>
                            </div>
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                <span>asd</span>
                            </div>
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                <span>asd</span>
                            </div>
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                <span>asd</span>
                            </div>
                            <div>
                                <img src={empty_badge} alt="empty"/>
                                <span>asd</span>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className="club-matchup">

                    </div>
                    <div className="club-calender">

                    </div>
                    <div className="club-gallery">

                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;