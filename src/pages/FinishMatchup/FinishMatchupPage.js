import React, { useState, useEffect } from "react";
import Sidebar from "../../components/SideBar/SideBar";
import FinishMatchupModal from "./FinishMatchupModal";
import FinishMatchupDetailModal from "./FinishMatchupDetailModal";
import "./FinishMatchupPage.css";
import arrow from "../../assets/arrow.svg";

const FinishMatchupPage = () => {
  const [matchups, setMatchups] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetailMatch, setSelectedDetailMatch] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
            "Content-Type": "application/json",
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

  const handleFinishClick = (match) => {
    setSelectedMatch(match);
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
                {matchups.map((match) => (
                  <tr key={match.matchPostId}>
                    <td>{match.matchDate}</td>
                    <td>{match.sportCategory}</td>
                    <td>
                      <div className="opponent-cell">
                        <img
                          src={match.logo}
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
                        <button
                          className="finish-btn"
                          onClick={() => handleFinishClick(match)}
                        >
                          마무리하기
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">종료된 매치업이 없습니다.</div>
          )}
        </div>

        <div className="pagination">
          <button className="page-control">&lt;&lt;</button>
          <button className="page-control">&lt;</button>
          <button className="page-number active">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <button className="page-control">&gt;</button>
          <button className="page-control">&gt;&gt;</button>
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
