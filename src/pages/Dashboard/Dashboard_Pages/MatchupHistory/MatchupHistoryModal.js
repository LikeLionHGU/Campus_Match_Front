import React, { useState } from "react";
import "./MatchupHistoryModal.css";

const MatchupHistoryModal = ({ mode, historyData, onClose, onSuccess }) => {
  const [matchDate, setMatchDate] = useState(historyData?.matchDate || "");
  const [location, setLocation] = useState(historyData?.location || "");
  const [opponentClub, setOpponentClub] = useState(historyData?.clubName || "");
  const [matchCategory, setMatchCategory] = useState(
    historyData?.result === "교류" ? "교류" : "경기",
  );
  const [result, setResult] = useState(
    historyData?.result === "교류" ? "" : historyData?.result || "",
  );

  const isEdit = mode === "edit";

  const handleSubmit = async () => {
    try {
      const clubId = localStorage.getItem("clubId");
      const token = localStorage.getItem("Authorization");

      const body = isEdit
        ? {
            matchHistoryId:
              historyData.historyMatchId || historyData.matchHistoryId,
            matchDate: matchDate,
            location: location,
            clubName: opponentClub,
            matchType: matchCategory !== "교류",
            result: matchCategory === "교류" ? "교류" : result,
          }
        : {
            clubId: Number(clubId),
            // oppositionClubId: 1,
            matchDate: matchDate,
            location: location,
            clubName: opponentClub,
            matchType: matchCategory !== "교류",
            result: matchCategory === "교류" ? "교류" : result,
          };

      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/matchHistory`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify(body),
        },
      );

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

  return (
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
              type="text"
              placeholder="00.00.00"
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
            <input
              type="text"
              value={opponentClub}
              onChange={(e) => setOpponentClub(e.target.value)}
            />
          </div>

          <div
            className="history-modal-row"
            style={{ alignItems: "flex-start" }}
          >
            <label style={{ marginTop: "6px" }}>결과</label>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
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
  );
};

export default MatchupHistoryModal;
