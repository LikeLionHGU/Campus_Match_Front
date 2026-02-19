import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SideBar/SideBar";
import FinishMatchupModal from "./FinishMatchupModal";
import FinishMatchupDetailModal from "./FinishMatchupDetailModal";
import "./FinishMatchupPage.css";
import arrow from "../../assets/arrow.svg";
import DefaultLogo from "../../assets/Main_Icon_Gray.svg";

const FinishMatchupPage = () => {
  const [matchups, setMatchups] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetailMatch, setSelectedDetailMatch] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMatchups(data.List || data);
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
        `${process.env.REACT_APP_HOST_URL}/api/matchPost/finish/detail/${match.matchPostId}`,
        {
          method: "GET",
          headers: {
            Authorization: token || "",
          },
        },
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

  return (
    <div className="finish-matchup-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="finish-matchup-content">
        <div className="finish-matchup-header">
          <div className="finish-matchup-title">종료된 매치업</div>
          <div className="finish-matchup-subtitle">
            마무리하기를 눌러 매치업 히스토리를 작성해주세요
          </div>
        </div>

        <div className="matchup-list-container">
          {matchups.length > 0 ? (
            <>
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
                  {(() => {
                    const indexOfLastItem = currentPage * itemsPerPage;
                    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                    const currentItems = matchups.slice(
                      indexOfFirstItem,
                      indexOfLastItem,
                    );

                    return currentItems.map((match) => (
                      <tr key={match.matchPostId}>
                        <td>{match.matchDate}</td>
                        <td>{match.sportCategory}</td>
                        <td>
                          <div className="opponent-cell">
                            <img
                              src={match.logo || DefaultLogo}
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
                              onClick={() => handleDetailClick(match)}
                            >
                              세부정보
                            </button>
                            <span className="separator">/</span>
                            <button
                              className="finish-btn"
                              onClick={() => handleFinishClick(match)}
                            >
                              마무리하기
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
              <div className="pagination">
                {(() => {
                  const totalPages = Math.ceil(matchups.length / itemsPerPage);
                  return (
                    <>
                      <button
                        className="page-control double"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        &lt;&lt;
                      </button>
                      <button
                        className="page-control"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        &lt;
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => (
                          <button
                            key={number}
                            className={`page-number ${
                              currentPage === number ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(number)}
                          >
                            {number}
                          </button>
                        ),
                      )}

                      <button
                        className="page-control"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        &gt;
                      </button>
                      <button
                        className="page-control double"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        &gt;&gt;
                      </button>
                    </>
                  );
                })()}
              </div>
            </>
          ) : (
            <div className="empty-state">종료된 매치업이 없습니다.</div>
          )}
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
