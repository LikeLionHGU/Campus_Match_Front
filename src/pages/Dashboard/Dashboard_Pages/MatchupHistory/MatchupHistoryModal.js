import React, { useState } from "react";
import "./MatchupHistoryModal.css";
import closeIcon from "../../../../assets/close.svg";

const MatchupHistoryModal = ({ mode, historyData, onClose, onSuccess }) => {
  const [matchDate, setMatchDate] = useState(historyData?.matchDate || "");
  const [location, setLocation] = useState(historyData?.location || "");
  const [opponentClubName, setOpponentClubName] = useState(
    historyData?.awayClubName || historyData?.clubName || "",
  );
  const [opponentClubId, setOpponentClubId] = useState(
    historyData?.awayClubId || null,
  );
  const [matchCategory, setMatchCategory] = useState(
    historyData?.result === "교류" ? "교류" : "경기",
  );
  const [result, setResult] = useState(
    historyData?.result === "교류" ? "" : historyData?.result || "",
  );

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const isEdit = mode === "edit";

  const handleSubmit = async () => {
    try {
      const clubId = localStorage.getItem("clubId");
      const token = localStorage.getItem("Authorization");

      const matchHistoryId = isEdit
        ? historyData.historyMatchId || historyData.matchHistoryId
        : null;

      const body = isEdit
        ? {
            matchDate: matchDate,
            location: location,
            awayClubId: opponentClubId,
            matchType: matchCategory !== "교류",
            result: matchCategory === "교류" ? "교류" : result,
          }
        : {
            clubId: Number(clubId),
            matchDate: matchDate,
            location: location,
            awayClubId: opponentClubId,
            matchType: matchCategory !== "교류",
            result: matchCategory === "교류" ? "교류" : result,
          };

      const url = isEdit
        ? `${process.env.REACT_APP_HOST_URL}/api/matchHistory/${matchHistoryId}`
        : `${process.env.REACT_APP_HOST_URL}/api/matchHistory`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert(isEdit ? "수정에 실패했습니다." : "저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error saving match history:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    setIsSearching(true);
    try {
      const token = localStorage.getItem("Authorization");

      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/club`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({
            regionList: [],
            sportCategoryList: [],
            keyword: searchKeyword,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.List || [];
        let results = Array.isArray(list)
          ? list
          : typeof list === "object"
            ? [list]
            : [];
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectClub = (club) => {
    setOpponentClubId(club.clubId);
    setOpponentClubName(club.clubName);
    setIsSearchModalOpen(false);
    setSearchKeyword("");
    setSearchResults([]);
  };

  return (
    <>
      <div className="history-modal-overlay" onClick={onClose}>
        <div
          className="history-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="history-modal-title">
            {isEdit ? "매치업 히스토리 수정하기" : "매치업 히스토리 작성하기"}
          </div>

          <div className="history-modal-form">
            <div className="history-modal-row">
              <label>날짜</label>
              <input
                type="date"
                required
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
            </div>

            <div className="history-modal-row">
              <label>장소</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="history-modal-row">
              <label>상대 동아리</label>
              <div className="history-modal-search-input">
                <input
                  type="text"
                  value={opponentClubName}
                  readOnly
                  placeholder="동아리를 검색해주세요"
                />
                <button
                  className="history-modal-search-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSearchModalOpen(true);
                  }}
                >
                  찾기
                </button>
              </div>
            </div>

            <div
              className="history-modal-row"
              style={{ alignItems: "flex-start" }}
            >
              <label style={{ marginTop: "6px" }}>결과</label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div className="history-modal-radio-group">
                  <label className="history-radio-label">
                    <input
                      type="radio"
                      name="matchCategory"
                      checked={matchCategory === "경기"}
                      onChange={() => {
                        setMatchCategory("경기");
                        setResult("");
                      }}
                    />
                    경기
                  </label>
                  {matchCategory === "경기" && (
                    <>
                      <label className="history-radio-label">
                        <input
                          type="radio"
                          name="result"
                          checked={result === "승"}
                          onChange={() => setResult("승")}
                        />
                        승
                      </label>
                      <label className="history-radio-label">
                        <input
                          type="radio"
                          name="result"
                          checked={result === "패"}
                          onChange={() => setResult("패")}
                        />
                        패
                      </label>
                      <label className="history-radio-label">
                        <input
                          type="radio"
                          name="result"
                          checked={result === "무"}
                          onChange={() => setResult("무")}
                        />
                        무
                      </label>
                    </>
                  )}
                </div>
                <div className="history-modal-radio-group">
                  <label className="history-radio-label">
                    <input
                      type="radio"
                      name="matchCategory"
                      checked={matchCategory === "교류"}
                      onChange={() => {
                        setMatchCategory("교류");
                        setResult("교류");
                      }}
                    />
                    단순 교류
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="history-modal-buttons">
            <button className="history-modal-cancel" onClick={onClose}>
              취소
            </button>
            <button className="history-modal-submit" onClick={handleSubmit}>
              {isEdit ? "수정" : "저장"}
            </button>
          </div>
        </div>
      </div>

      {isSearchModalOpen && (
        <div
          className="search-modal-overlay"
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div
            className="search-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-modal-header">
              <h3>동아리 찾기</h3>
              <img
                src={closeIcon}
                alt="close"
                className="search-modal-close"
                onClick={() => setIsSearchModalOpen(false)}
              />
            </div>
            <div className="search-modal-input-row">
              <input
                type="text"
                placeholder="동아리명 입력"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "검색 중" : "검색"}
              </button>
            </div>
            <div className="search-modal-results">
              {searchResults.length > 0 ? (
                searchResults.map((club, idx) => (
                  <div
                    key={idx}
                    className="search-modal-result-item"
                    onClick={() => handleSelectClub(club)}
                  >
                    <div className="club-info">
                      <span className="club-name">
                        {club.awayClubName || club.clubName || "알 수 없음"}
                      </span>
                      {club.university && (
                        <span className="club-univ">{club.university}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-modal-empty">
                  {isSearching ? "검색 중입니다..." : "검색 결과가 없습니다."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MatchupHistoryModal;
