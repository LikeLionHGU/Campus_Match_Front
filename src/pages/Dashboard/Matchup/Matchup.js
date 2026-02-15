import "./Matchup.css";
import { useNavigate } from "react-router-dom";

const Matchup = () => {
    const navigate = useNavigate();
    return(
        <>
            <div className="matchup-frame">
                <div className="matchup-top">
                    <div className="matchup-top-left" onClick={() => navigate("/dashboard/upcoming-matchup")}>
                        <div className="matchup-top-left-header">
                            <span>예정된 매치업</span>
                        </div>
                        <div className="matchup-top-left-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>날짜</th>
                                        <th>동아리/대학</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="matchup-first-row">
                                        <th>2026.3.19</th>
                                        <th>밀란/한동대학교</th>
                                    </tr>
                                    <tr>
                                        <th>2026.3.19</th>
                                        <th>밀란/한동대학교</th>
                                    </tr>
                                    <tr>

                                    </tr>
                                    <tr>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="matchup-top-right">
                        <div className="matchup-top-right-header">
                            <span>진행중인 매치업</span>
                        </div>
                        <div className="matchup-top-right-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>날짜</th>
                                        <th>동아리/대학</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="matchup-first-row">
                                        <th>2026.3.19</th>
                                        <th>밀란/한동대학교</th>
                                    </tr>
                                    <tr>
                                        <th>2026.3.19</th>
                                        <th>밀란/한동대학교</th>
                                    </tr>
                                    <tr>

                                    </tr>
                                    <tr>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="matchup-middle">
                    <div className="matchup-middle-header">
                        <span>제안받은 매치업</span>
                    </div>
                    <div className="matchup-middle-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>날짜</th>
                                    <th>동아리/대학</th>
                                    <th>종목</th>
                                    <th>매치온도</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="matchup-first-row">
                                    <th>2026.3.19</th>
                                    <th>밀란/한동대학교</th>
                                    <th>축구</th>
                                    <th>50°C</th>
                                </tr>
                                <tr>
                                    <th>2026.3.19</th>
                                    <th>밀란/한동대학교</th>
                                    <th>축구</th>
                                    <th>50°C</th>
                                </tr>
                                <tr>

                                </tr>
                                <tr>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="matchup-bottom">
                    <div className="matchup-bottom-header">
                        <span>제안한 매치업</span>
                    </div>
                    <div className="matchup-bottom-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>날짜</th>
                                    <th>동아리/대학</th>
                                    <th>종목</th>
                                    <th>매치온도</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="matchup-first-row">
                                    <th>2026.3.19</th>
                                    <th>밀란/한동대학교</th>
                                    <th>축구</th>
                                    <th>50°C</th>
                                </tr>
                                <tr>
                                    <th>2026.3.19</th>
                                    <th>밀란/한동대학교</th>
                                    <th>축구</th>
                                    <th>50°C</th>
                                </tr>
                                <tr>

                                </tr>
                                <tr>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Matchup;