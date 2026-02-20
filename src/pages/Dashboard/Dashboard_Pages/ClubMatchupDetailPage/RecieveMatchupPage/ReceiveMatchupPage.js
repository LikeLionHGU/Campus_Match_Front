import Sidebar from "../../../../../components/SideBar/SideBar";
import "./ReceiveMatchupPage.css";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../../../../assets/arrow_left.svg";
import { useState, useEffect } from "react";
import ArrowLeft from "../../../../../assets/arrow_left.svg";
import ArrowLeftDouble from "../../../../../assets/arrow_left_double.svg";
import ArrowRight from "../../../../../assets/arrow_right.svg";
import ArrowRightDouble from "../../../../../assets/arrow_right_double.svg";
import ArrowDown from "../../../../../assets/arrow_down.svg";
import MatchupRefuseModal from "../Modal/MatchupRefuseModal/MatchupRefuseModal";
import MatchupDetailModal from "../Modal/MatchupDetailModal/MatchupDetailModal";
import SuccessModal from "../../ClubCalenderDetailPage/SuccessModal/SuccessModal";
import MatchupAcceptModal from "../Modal/MatchupAcceptModal/MatchupAcceptModal";
import DefaultLogo from "../../../../../assets/Main_Icon_Gray.svg";

const ReceiveMatchupPage = () => {
  const navigate = useNavigate();
  const [matchups, setMatchups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateOrder, setDateOrder] = useState("asc");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const sortedMatchups = [...matchups].sort((a, b) => {
    const dateA = new Date(a.matchDate);
    const dateB = new Date(b.matchDate);

    return dateOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const pageSize = 10;
  const fetchReceive = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/matchRequest/receive`,
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
    fetchReceive();
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
        <div className="receive-matchup-container">
          <div className="receive-matchup-header" onClick={() => navigate(-1)}>
            <img src={BackArrow} alt="back-arrow" />
            <span>제안받은 매치업</span>
          </div>
          <div className="receive-match-main">
            <div className="receive-match-content">
              <div className="receive-match-table-wrapper">
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
                      <th>세부 정보 / 거절 / 수락</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedMatchups.map((item) => (
                      <tr key={item.matchRequestId}>
                        <td>{item.matchDate}</td>
                        <td>{item.sportCategory}</td>
                        <td>
                          <div className="receive-club-info">
                            <img
                              src={item.imageUrl || DefaultLogo}
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
                                setSelectedMatchId(item.matchRequestId);
                                setDetailModalOpen(true);
                              }}
                            >
                              세부 정보
                            </button>
                            &nbsp;/&nbsp;
                            <button
                              className="refuse-button"
                              onClick={() => {
                                setSelectedMatchId(item.matchRequestId);
                                setCancelModalOpen(true);
                              }}
                            >
                              거절
                            </button>
                            &nbsp;/&nbsp;
                            <button
                              className="receive-button"
                              onClick={() => {
                                setSelectedMatchId(item.matchRequestId);
                                setAcceptModalOpen(true);
                              }}
                            >
                              수락
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="receive-pagination">
                <div className="pagination-move">
                  <img
                    className="receive-pagination-double"
                    src={ArrowLeftDouble}
                    alt="<<"
                    onClick={goFirstBlock}
                    disabled={currentPage === 1}
                  />
                  <img
                    className="receive-pagination-mono"
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
                    className="receive-pagination-mono"
                    src={ArrowRight}
                    alt=">"
                    onClick={goNext}
                    disabled={currentPage === totalPages}
                  />
                  <img
                    className="receive-pagination-double"
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
          matchRequestId={selectedMatchId}
          matchType="matchRequest"
          type="receive"
          onClose={() => setDetailModalOpen(false)}
        />
      )}

      {cancelModalOpen && (
        <MatchupRefuseModal
          matchRequestId={selectedMatchId}
          type="receive"
          onClose={() => setCancelModalOpen(false)}
          message="해당 매치업을 거절하시겠습니까?"
          onSuccess={() => {
            setCancelModalOpen(false);
            setSuccessModalOpen(true);
            fetchReceive();
          }}
        />
      )}

      {acceptModalOpen && (
        <MatchupAcceptModal
          matchRequestId={selectedMatchId}
          onConfirm={() => {
            setAcceptModalOpen(false);
            setSuccessModalOpen(true);
            fetchReceive();
          }}
          onClose={() => setAcceptModalOpen(false)}
        />
      )}

      {successModalOpen && (
        <SuccessModal
          message="거절이 완료되었습니다"
          onConfirm={() => setSuccessModalOpen(false)}
        />
      )}
    </>
  );
};

export default ReceiveMatchupPage;
