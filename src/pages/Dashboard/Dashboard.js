import "./Dashboard.css";
import "./Club-record.css";
import TempRing from "./TempRing";

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
                            <h3>
                                동아리 소개
                            </h3>
                            <p>
                                asdasdasd
                            </p>
                        </div>
                    </div>
                    <div className="club-record">
                        <div className="club-record-top">

                        </div>
                        <div className="club-record-bottom">

                        </div>
                    </div>
                    <div className="club-badge">
                        
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