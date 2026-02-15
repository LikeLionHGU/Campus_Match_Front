import Sidebar from "../../../../../components/SideBar/SideBar";
import "./UpcomingMatchupPage.css";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../../../../assets/arrow_left.svg"
import { useState,useEffect } from "react";
import ArrowLeft from "../../../../../assets/arrow_left.svg"
import ArrowLeftDouble from "../../../../../assets/arrow_left_double.svg"
import ArrowRight from "../../../../../assets/arrow_right.svg"
import ArrowRightDouble from "../../../../../assets/arrow_right_double.svg"

const UpcomingMatchupPage = () =>{
    const navigate = useNavigate();
    const [matchups, setMatchups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 10;
    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const clubId = localStorage.getItem("clubId");

                const res = await fetch(
                    `${process.env.REACT_APP_HOST_URL}/api/matchPost/upcoming/${clubId}`,
                    {
                        headers: {
                            "Authorization": localStorage.getItem("Authorization"),
                        },
                    }
                );

                if (!res.ok) throw new Error();

                const data = await res.json();

                setMatchups(Array.isArray(data) ? data : data.List || []);

            } catch (e) {
                console.error("upcoming load fail", e);
            }
        };
    fetchUpcoming();
    }, []);
    const totalPages = Math.max(1, Math.ceil(matchups.length / pageSize));

    const pagedMatchups = matchups.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const goFirstBlock = () => {
        setCurrentPage((prev) => Math.max(1, prev - 10));
    };

    const goPrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const goNext = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    const goLastBlock = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 10));
    };
    return(
        <>
            <div className="container">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="upcoming-matchup-container">
                    <div className="upcoming-matchup-header" onClick={() => navigate(-1)}>
                        <img src={BackArrow} alt="back-arrow" />
                        <span>예정된 매치업</span>
                    </div>
                    <div className="upcoming-match-main">
                        <div className="upcoming-match-content">
                            <div className="upcoming-match-table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                <div>
                                                    <span>날짜</span>
                                                    <img/>
                                                </div>
                                            </th>
                                            <th>종목</th>
                                            <th>동아리/대학</th>
                                            <th>지역</th>
                                            <th>장소</th>
                                            <th>매치온도</th>
                                            <th>세부정보/매치업취소</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pagedMatchups.map((item) => (
                                            <tr key={item.matchId}>
                                                <td>{item.matchDate}</td>
                                                <td>{item.sportCategory}</td>
                                                <td>
                                                    <div>
                                                        <img src={item.clubImage} alt="club-icon" />
                                                        <span>{item.clubName}/{item.university}</span>
                                                    </div>
                                                </td>
                                                <td>{item.region}</td>
                                                <td>{item.location}</td>
                                                <td>{item.mannerScore}°C</td>
                                                <td>
                                                    <div>
                                                        <button>세부정보</button>
                                                        &nbsp;/&nbsp;
                                                        <button>취소하기</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="upcoming-pagination">
                                <div className="pagination-move">
                                    <img className="upcoming-pagination-double" src={ArrowLeftDouble} alt="<<" onClick={goFirstBlock} disabled={currentPage === 1} />
                                    <img className="upcoming-pagination-mono" src={ArrowLeft} alt="<" onClick={goPrev} disabled={currentPage === 1}/>
                                </div>
                    
                                
            
                                <div className="pagination-numbers">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            className={currentPage === i + 1 ? "active" : ""}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <div className="pagination-move">
                                    <img className="upcoming-pagination-mono" src={ArrowRight} alt=">"  onClick={goNext} disabled={currentPage === totalPages} />
                                    <img className="upcoming-pagination-double" src={ArrowRightDouble} alt=">>" onClick={goLastBlock} disabled={currentPage === totalPages} />
                                </div>
                                
                            

            
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default UpcomingMatchupPage;