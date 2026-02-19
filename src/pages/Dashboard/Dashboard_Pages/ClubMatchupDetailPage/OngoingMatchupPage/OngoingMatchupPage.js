import Sidebar from "../../../../../components/SideBar/SideBar";
import "./OngoingMatchupPage.css";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../../../../assets/arrow_left.svg";
import { useState, useEffect } from "react";
import ArrowLeft from "../../../../../assets/arrow_left.svg";
import ArrowLeftDouble from "../../../../../assets/arrow_left_double.svg";
import ArrowRight from "../../../../../assets/arrow_right.svg";
import ArrowRightDouble from "../../../../../assets/arrow_right_double.svg";
import ArrowDown from "../../../../../assets/arrow_down.svg";
import MatchupDetailModal from "../Modal/MatchupDetailModal/MatchupDetailModal";
import MatchupFinishModal from "../Modal/MatchupFinishModal/MatchupFinishModal";
import SuccessModal from "../../ClubCalenderDetailPage/SuccessModal/SuccessModal";
import DefaultLogo from "../../../../../assets/Main_Icon_Gray.svg";
const OngoingMatchupPage = () => {
  const navigate = useNavigate();
  const [matchups, setMatchups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateOrder, setDateOrder] = useState("asc");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const sortedMatchups = [...matchups].sort((a, b) => {
    const dateA = new Date(a.matchDate);
    const dateB = new Date(b.matchDate);

    return dateOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const pageSize = 10;
  const fetchOngoing = async () => {
    try {
      const clubId = localStorage.getItem("clubId");

      const res = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/matchPost/ongoing/${clubId}`,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        },
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setMatchups(Array.isArray(data) ? data : data.List || []);
    } catch (e) {
      console.error("upcoming load fail", e);
    }
  };
  useEffect(() => {
    fetchOngoing();
  }, []);
  const totalPages = Math.max(1, Math.ceil(matchups.length / pageSize));

  const pagedMatchups = sortedMatchups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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
  return (
    <>
      <div className="container">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="ongoing-matchup-container">
          <div className="ongoing-matchup-header" onClick={() => navigate(-1)}>
            <img src={BackArrow} alt="back-arrow" />
            <span>진행중인 매치업</span>
          </div>
          <div className="ongoing-match-main">
            <div className="ongoing-match-content">
              <div className="ongoing-match-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <div
                          className="thead-date"
                          onClick={() =>
                            setDateOrder((prev) =>
                              prev === "asc" ? "desc" : "asc",
                            )
                          }
                        >
                          <span>날짜</span>
                          <img
                            className={dateOrder === "desc" ? "rotate" : ""}
                            src={ArrowDown}
                            alt="down_arrow"
                          />
                        </div>
                      </th>
                      <th>종목</th>
                      <th>동아리/대학</th>
                      <th>지역</th>
                      <th>장소</th>
                      <th>매치온도</th>
                      <th>세부 정보 / 매치업 취소</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedMatchups.map((item) => (
                      <tr key={item.matchId}>
                        <td>{item.matchDate}</td>
                        <td>{item.sportCategory}</td>
                        <td>
                          <div className="ongoing-club-info">
                            <img
                              src={item.clubImage || DefaultLogo}
                              alt="club-icon"
                            />
                            <span>
                              {item.clubName}/{item.university}
                            </span>
                          </div>
                        </td>
                        <td>{item.region}</td>
                        <td>{item.location}</td>
                        <td>{item.mannerScore}°C</td>
                        <td>
                          <div>
                            <button
                              onClick={() => {
                                setSelectedMatchId(item.matchPostId);
                                setDetailModalOpen(true);
                              }}
                            >
                              세부정보
                            </button>
                            &nbsp;/&nbsp;
                            <button
                              onClick={() => {
                                setSelectedMatchId(item.matchPostId);
                                setFinishModalOpen(true);
                              }}
                            >
                              종료하기
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ongoing-pagination">
                <div className="pagination-move">
                  <img
                    className="ongoing-pagination-double"
                    src={ArrowLeftDouble}
                    alt="<<"
                    onClick={goFirstBlock}
                    disabled={currentPage === 1}
                  />
                  <img
                    className="ongoing-pagination-mono"
                    src={ArrowLeft}
                    alt="<"
                    onClick={goPrev}
                    disabled={currentPage === 1}
                  />
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
                  <img
                    className="ongoing-pagination-mono"
                    src={ArrowRight}
                    alt=">"
                    onClick={goNext}
                    disabled={currentPage === totalPages}
                  />
                  <img
                    className="ongoing-pagination-double"
                    src={ArrowRightDouble}
                    alt=">>"
                    onClick={goLastBlock}
                    disabled={currentPage === totalPages}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {detailModalOpen && (
        <MatchupDetailModal
          matchPostId={selectedMatchId}
          matchType="matchPost"
          type="ongoing"
          onClose={() => setDetailModalOpen(false)}
        />
      )}

      {finishModalOpen && (
        <MatchupFinishModal
          matchPostId={selectedMatchId}
          onClose={() => setFinishModalOpen(false)}
          onSuccess={() => {
            setFinishModalOpen(false);
            setSuccessModalOpen(true);
            fetchOngoing();
          }}
        />
      )}

      {successModalOpen && (
        <SuccessModal
          message="취소 요청이 완료되었습니다"
          onConfirm={() => setSuccessModalOpen(false)}
        />
      )}
    </>
  );
};

export default OngoingMatchupPage;
