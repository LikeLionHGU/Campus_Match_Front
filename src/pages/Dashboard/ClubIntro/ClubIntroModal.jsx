import React, { useState, useEffect, useCallback } from "react";
import closeIcon from "../../../assets/close.svg";
import ClubIntroTempRing from "./ClubIntroTempRing";
import "./ClubIntroModal.css";

const ClubIntroModal = ({ clubId, onClose, onUpdate }) => {
  const [mannerScore, setMannerScore] = useState(0);
  const [description, setDescription] = useState("");
  const [awards, setAwards] = useState([]);
  const [newAward, setNewAward] = useState("");
  const [isMine, setIsMine] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("Authorization");

  const fetchDescription = useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/club/description/${clubId}`,
        {
          method: "GET",
          headers: { Authorization: token || "" },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setMannerScore(data.mannerScore || 0);
        setDescription(data.description || "");
        setAwards(data.awardResDtoList || []);
        setIsMine(data.isMine || false);
      }
    } catch (e) {
      console.error("Error fetching description:", e);
    } finally {
      setLoading(false);
    }
  }, [clubId, token]);

  useEffect(() => {
    if (clubId) fetchDescription();
  }, [clubId, fetchDescription]);

  const handleAddAward = async () => {
    if (!newAward.trim()) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/club/award`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({ title: newAward }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        setAwards((prev) => [...prev, data]);
        setNewAward("");
      } else {
        alert("수상경력 추가 실패");
      }
    } catch (e) {
      console.error("Error adding award:", e);
    }
  };

  const handleDeleteAward = async (awardId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/club/award/${awardId}`,
        {
          method: "DELETE",
          headers: { Authorization: token || "" },
        },
      );
      if (res.ok) {
        setAwards((prev) => prev.filter((a) => a.awardId !== awardId));
      } else {
        alert("수상경력 삭제 실패");
      }
    } catch (e) {
      console.error("Error deleting award:", e);
    }
  };

  const handleUpdateDescription = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/club/description`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({ description }),
        },
      );
      if (res.ok) {
        alert("동아리 소개가 수정되었습니다.");
        if (onUpdate) onUpdate();
      } else {
        alert("수정 실패");
      }
    } catch (e) {
      console.error("Error updating description:", e);
    }
  };

  if (loading) return null;

  return (
    <div className="club-intro-modal-backdrop" onClick={onClose}>
      <div className="club-intro-modal" onClick={(e) => e.stopPropagation()}>
        <img
          src={closeIcon}
          alt="close"
          className="club-intro-modal-close"
          onClick={onClose}
        />

        <div className="club-intro-modal-header">
          <div className="club-intro-modal-label">매치온도</div>
          <ClubIntroTempRing temperature={mannerScore} />
        </div>

        <div className="club-intro-modal-section">
          <span className="club-intro-modal-label">동아리 업적</span>
          <div className="award-list-container">
            <div className="award-list">
              {awards.map((award) => (
                <div className="award-item" key={award.awardId}>
                  <div className="award-text">{award.title}</div>
                  {isMine && (
                    <button
                      className="award-delete-btn"
                      onClick={() => handleDeleteAward(award.awardId)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isMine && (
              <div className="award-add-row">
                <input
                  type="text"
                  value={newAward}
                  onChange={(e) => setNewAward(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === "Enter") handleAddAward();
                  }}
                />
                <button className="award-add-btn" onClick={handleAddAward}>
                  ✓
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="club-intro-modal-section">
          <span className="club-intro-modal-label">동아리 소개</span>
          <textarea
            className="club-intro-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly={!isMine}
            maxLength={200}
          />
          <div className="club-intro-textarea-count">
            {description.length}/200
          </div>
          {isMine && (
            <div className="club-intro-submit-row">
              <button
                className="club-intro-submit-btn"
                onClick={handleUpdateDescription}
              >
                수정
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubIntroModal;
