import BackArrow from "../../../../assets/arrow_left.svg";
import "./ClubCalenderDetailPage.css";
import Sidebar from "../../../../components/SideBar/SideBar";

const ClubCalenderDetailPage = () =>{
    return(
        <>
            <div className="container">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="calender-detail-container">
                    <div className="calender-detail-header">
                        <img src={BackArrow} alt="back-arrow" />
                        <span>스케줄</span>
                    </div>
                    <div className="calender-detail-main">
                        <div className="calender-detail-left">

                        </div>
                        <div className="calender-detail-right">
                            <div className="calender-detail-right-top">

                            </div>
                            <div className="calender-detail-right-bottom">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default ClubCalenderDetailPage