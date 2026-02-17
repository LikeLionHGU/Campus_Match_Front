import Sidebar from "../../components/SideBar/SideBar";
import "./MatchupBoardPage.css";

const MatchupBoardPage = () => {
    return(
        <>
            <div className="container">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="matchup-board-container">

                </div>
            </div>
        </>
    );
}

export default MatchupBoardPage;