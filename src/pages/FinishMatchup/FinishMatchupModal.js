import React, { useState } from "react";
import "./FinishMatchupModal.css";

const FinishMatchupModal = ({ onClose, match }) => {
  const [title, setTitle] = useState("");
  const [result, setResult] = useState("match");
  const [temperature, setTemperature] = useState("up");
  const [rematch, setRematch] = useState("yes");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (images.length + newImages.length > 5) {
        return;
      }
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      return;
    }

    try {
      const token = localStorage.getItem("Authorization");
      const matchDate = match
        ? match.matchDate
        : new Date().toISOString().split("T")[0];

      const formData = new FormData();

      const requestData = {
        title: title,
        matchDate: matchDate,
        isOfficial: true,
        result: result,
        temperature: temperature,
        rematch: rematch,
      };

      const jsonBlob = new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      });
      formData.append("request", jsonBlob, "request.json");

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/gallery`,
        {
          method: "POST",
          headers: {
            Authorization: token || "",
          },
          body: formData,
        },
      );

      if (response.ok) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting finish matchup:", error);
    }
  };

  return (
    <div className="finish-modal-overlay" onClick={onClose}>
      <div
        className="finish-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="finish-modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="finish-modal-header">
          <h2>마무리하기</h2>
        </div>

        <div className="upload-section">
          <label className="upload-box">
            {images.length > 0 ? (
              <img
                src={URL.createObjectURL(images[0])}
                alt="preview"
                className="upload-preview"
              />
            ) : (
              <div className="upload-placeholder-content">
                <span className="upload-icon"></span>
                <span className="upload-text">사진 올리기</span>
                <span className="upload-text">0/5</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="image-file-input"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="form-section">
          <div className="form-row">
            <span className="form-label">이름</span>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-row">
            <span className="form-label">결과</span>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="result"
                  checked={result === "match"}
                  onChange={() => setResult("match")}
                />
                경기
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="result"
                  checked={result === "exchange"}
                  onChange={() => setResult("exchange")}
                />
                단순 교류
              </label>
            </div>
          </div>

          <div className="form-row">
            <span className="form-label">매치 온도</span>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="temperature"
                  checked={temperature === "up"}
                  onChange={() => setTemperature("up")}
                />
                업
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="temperature"
                  checked={temperature === "down"}
                  onChange={() => setTemperature("down")}
                />
                다운
              </label>
            </div>
          </div>

          <div className="form-row">
            <span className="form-label">재매치 의사</span>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="rematch"
                  checked={rematch === "yes"}
                  onChange={() => setRematch("yes")}
                />
                예
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="rematch"
                  checked={rematch === "no"}
                  onChange={() => setRematch("no")}
                />
                아니오
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="modal-btn save-btn" onClick={handleSubmit}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishMatchupModal;
