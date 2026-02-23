import React, { useState } from "react";
import "./FinishMatchupModal.css";
import closeIcon from "../../assets/close.svg";

const FinishMatchupModal = ({ onClose, match }) => {
  const [title, setTitle] = useState("");
  const [matchCategory, setMatchCategory] = useState("");
  const [result, setResult] = useState("");
  const [temperature, setTemperature] = useState("up");
  const [rematch, setRematch] = useState("yes");
  const [images, setImages] = useState([]);
  const [step, setStep] = useState("form");

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => {
        const combined = [...prev, ...newImages];
        if (combined.length > 5) {
          alert("사진은 최대 5장까지 올릴 수 있습니다.");
          return combined.slice(0, 5);
        }
        return combined;
      });
      e.target.value = "";
    }
  };

  const handleSaveClick = () => {
    if (images.length === 0) {
      alert("사진을 1장 이상 올려주세요.");
      return;
    }
    if (!matchCategory) {
      alert("결과를 선택해주세요.");
      return;
    }
    if (matchCategory === "경기" && !result) {
      alert("승/패/무를 선택해주세요.");
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("Authorization");

      const formData = new FormData();

      const requestData = {
        title: title,
        matchType: matchCategory !== "교류",
        result: matchCategory === "교류" ? "교류" : result,
        mannerScore: temperature === "up",
        rematch: rematch === "yes",
      };

      const jsonBlob = new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      });
      formData.append("request", jsonBlob, "request.json");

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/matchHistory/finish/${match.matchPostId}`,
        {
          method: "POST",
          headers: {
            Authorization: token || "",
          },
          body: formData,
        },
      );

      if (response.ok) {
        setStep("success");
      } else {
        alert("저장에 실패했습니다.");
        setStep("form");
      }
    } catch (error) {
      console.error("Error submitting finish matchup:", error);
      alert("오류가 발생했습니다.");
      setStep("form");
    }
  };

  const handleSuccessClose = () => {
    onClose();
    window.location.reload();
  };

  if (step === "confirm") {
    return (
      <div className="finish-modal-overlay" onClick={() => setStep("form")}>
        <div
          className="finish-confirm-content"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={closeIcon}
            alt="close"
            className="finish-modal-close"
            onClick={() => setStep("form")}
          />
          <div className="confirm-title">매치업을 마무리하시겠습니까</div>
          <div className="modal-footer">
            <button
              className="modal-btn cancel-btn"
              onClick={() => setStep("form")}
            >
              취소
            </button>
            <button className="modal-btn save-btn" onClick={handleConfirm}>
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="finish-modal-overlay" onClick={handleSuccessClose}>
        <div
          className="finish-confirm-content"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={closeIcon}
            alt="close"
            className="finish-modal-close"
            onClick={handleSuccessClose}
          />
          <div className="confirm-title">매치업이 마무리 되었습니다</div>
          <p className="confirm-subtitle">
            작성한 글은 대시보드&gt;매치업 히스토리에서 확인 가능합니다
          </p>
          <div className="modal-footer">
            <button className="modal-btn save-btn" onClick={handleSuccessClose}>
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="finish-modal-overlay" onClick={onClose}>
      <div
        className="finish-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={closeIcon}
          alt="close"
          className="finish-modal-close"
          onClick={onClose}
        />

        <div className="finish-modal-header">
          <div>마무리하기</div>
        </div>

        <div className="upload-section">
          {images.length > 0 ? (
            <div className="upload-area-active">
              <div className="image-preview-container">
                {Array.from(images).map((file, index) => (
                  <div key={index} className="preview-item">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="upload-preview"
                    />
                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setImages((prev) => {
                          const newImages = [...prev];
                          newImages.splice(index, 1);
                          return newImages;
                        });
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              {images.length < 5 && (
                <label
                  className="upload-box"
                  style={{
                    width: "100%",
                    height: "60px",
                    flexDirection: "row",
                    gap: "10px",
                    marginTop: "10px",
                    backgroundColor: "#fafafa",
                    border: "2px dashed #ddd",
                  }}
                >
                  <div
                    className="upload-placeholder-content"
                    style={{ flexDirection: "row", gap: "8px" }}
                  >
                    <span
                      className="upload-icon"
                      style={{ marginBottom: 0 }}
                    ></span>
                    <span
                      className="upload-text"
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      추가하기
                    </span>
                    <span
                      className="upload-text"
                      style={{ fontSize: "12px", color: "#bbb" }}
                    >
                      {images.length}/5
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="image-file-input"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          ) : (
            <label className="upload-box">
              <div className="upload-placeholder-content">
                <span className="upload-icon"></span>
                <span className="upload-text">사진 올리기</span>
                <span className="upload-text">0/5</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="image-file-input"
                onChange={handleImageChange}
              />
            </label>
          )}
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
                경기
                <input
                  type="radio"
                  name="matchCategory"
                  checked={matchCategory === "경기"}
                  onChange={() => {
                    setMatchCategory("경기");
                    setResult("");
                  }}
                />
              </label>
              {matchCategory === "경기" && (
                <>
                  <label className="radio-label">
                    승
                    <input
                      type="radio"
                      name="result"
                      checked={result === "승"}
                      onChange={() => setResult("승")}
                    />
                  </label>
                  <label className="radio-label">
                    패
                    <input
                      type="radio"
                      name="result"
                      checked={result === "패"}
                      onChange={() => setResult("패")}
                    />
                  </label>
                  <label className="radio-label">
                    무
                    <input
                      type="radio"
                      name="result"
                      checked={result === "무"}
                      onChange={() => setResult("무")}
                    />
                  </label>
                </>
              )}
            </div>
            <div
              className="radio-group"
              style={{ marginTop: "8px", marginLeft: "96px" }}
            >
              <label className="radio-label">
                단순 교류
                <input
                  type="radio"
                  name="matchCategory"
                  checked={matchCategory === "교류"}
                  onChange={() => {
                    setMatchCategory("교류");
                    setResult("교류");
                  }}
                />
              </label>
            </div>
          </div>

          <div className="form-row">
            <span className="form-label">매치 온도</span>
            <div className="radio-group">
              <label className="radio-label">
                업
                <input
                  type="radio"
                  name="temperature"
                  checked={temperature === "up"}
                  onChange={() => setTemperature("up")}
                />
              </label>
              <label className="radio-label">
                다운
                <input
                  type="radio"
                  name="temperature"
                  checked={temperature === "down"}
                  onChange={() => setTemperature("down")}
                />
              </label>
            </div>
          </div>

          <div className="form-row">
            <span className="form-label">재매치 의사</span>
            <div className="radio-group">
              <label className="radio-label">
                예
                <input
                  type="radio"
                  name="rematch"
                  checked={rematch === "yes"}
                  onChange={() => setRematch("yes")}
                />
              </label>
              <label className="radio-label">
                아니오
                <input
                  type="radio"
                  name="rematch"
                  checked={rematch === "no"}
                  onChange={() => setRematch("no")}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="modal-btn save-btn" onClick={handleSaveClick}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishMatchupModal;
