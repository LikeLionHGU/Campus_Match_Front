import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SideBar/SideBar";
import FinishMatchupModal from "./FinishMatchupModal";
import FinishMatchupDetailModal from "./FinishMatchupDetailModal";
import "./FinishMatchupPage.css";
import arrow from "../../assets/arrow_down.svg";
import DefaultLogo from "../../assets/Main_Icon_Gray.svg";

const FinishMatchupPage = () => {
  const [matchups, setMatchups] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetailMatch, setSelectedDetailMatch] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const pagesPerBlock = 10; // 페이지 번호 최대 10개 표시

  useEffect(() => {
    fetchEndedMatchups();
  }, []);

  const fetchEndedMatchups = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/matchPost/finish`,
        {
          method: "GET",
          headers: {
            Authorization: token || "",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMatchups(data.List || data || []);
      } else {
        console.error("Failed to fetch ended matchups");
      }
    } catch (error) {
      console.error("Error fetching matchups:", error);
    }
  };

  const handleFinishClick = async (match) => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/matchPost/finish/${match.matchPostId}`,
        {
          method: "GET",
          headers: {
            Authorization: token || "",
          },
        }
      );

      if (response.ok) {
        const detail = await response.json();
        setSelectedMatch({ ...match, ...detail });
      } else {
        setSelectedMatch(match);
      }
    } catch (error) {
      console.error("Error fetching match detail:", error);
      setSelectedMatch(match);
    }
    setIsModalOpen(true);
  };

  const handleDetailClick = (match) => {
    setSelectedDetailMatch(match);
    setIsDetailModalOpen(true);
  };

  /* ---------------- pagination logic ---------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(matchups.length / itemsPerPage)
  );

  const currentBlock = Math.floor((currentPage - 1) / pagesPerBlock);

  const startPage = currentBlock * pagesPerBlock + 1;

  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = matchups.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const goFirstBlock = () => setCurrentPage(startPage - pagesPerBlock);
  const goLastBlock = () => setCurrentPage(startPage + pagesPerBlock);

  const goPrev = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const goNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  /* -------------------------------------------------- */

  return (
    <div className="finish-matchup-container">
      <div className="sidebar">
        <Sidebar />
      </div>

      <div className="finish-matchup-content">
        <div className="finish-matchup-header">
          <div className="finish-matchup-title">
            종료된 매치업
          </div>
          <div className="finish-matchup-subtitle">
            마무리하기를 눌러 매치업 히스토리를 작성해주세요
          </div>
        </div>

        <div className="matchup-list-container">

          <div className="matchup-table-wrapper">
            <table className="matchup-table">
              <thead>
                <tr>
                  <th>
                    날짜
                    <img src={arrow} alt="arrow" />
                  </th>
                  <th>종목</th>
                  <th>동아리/대학</th>
                  <th>지역</th>
                  <th>장소</th>
                  <th>매치온도</th>
                  <th>세부 정보 / 마무리하기</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                      종료된 매치업이 없습니다.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((match) => (
                    <tr key={match.matchPostId}>
                      <td>{match.matchDate}</td>

                      <td>{match.sportCategory}</td>

                      <td>
                        <div className="opponent-cell">
                          <img
                            src={match.imageUrl || DefaultLogo}
                            alt="logo"
                            className="opponent-logo"
                          />
                          {match.clubName}/{match.university}
                        </div>
                      </td>

                      <td>{match.region}</td>

                      <td>{match.location}</td>

                      <td>{match.mannerScore}°C</td>

                      <td>
                        <div className="action-buttons">

                          <button
                            className="detail-btn"
                            onClick={() =>
                              handleDetailClick(match)
                            }
                          >
                            세부정보
                          </button>

                          <button
                            className="finish-btn"
                            onClick={() =>
                              handleFinishClick(match)
                            }
                          >
                            마무리하기
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          {/* pagination */}

          <div className="pagination">

            <button
              className="page-control double"
              onClick={goFirstBlock}
              disabled={startPage === 1}
            >
              &lt;&lt;
            </button>

            <button
              className="page-control"
              onClick={goPrev}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`page-number ${
                  currentPage === number ? "active" : ""
                }`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="page-control"
              onClick={goNext}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>

            <button
              className="page-control double"
              onClick={goLastBlock}
              disabled={endPage === totalPages}
            >
              &gt;&gt;
            </button>

          </div>

        </div>

        {isModalOpen && selectedMatch && (
          <FinishMatchupModal
            onClose={() => setIsModalOpen(false)}
            match={selectedMatch}
          />
        )}

        {isDetailModalOpen && selectedDetailMatch && (
          <FinishMatchupDetailModal
            match={selectedDetailMatch}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}

      </div>
    </div>
  );
};

export default FinishMatchupPage;