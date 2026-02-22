import React, { useState } from "react";
import "./GalleryUploadModal.css";

const GalleryUploadModal = ({
  onClose,
  onSuccess,
  isOfficial = false,
  defaultTitle = "",
  defaultDate = "",
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [matchDate, setMatchDate] = useState(defaultDate);
  const [images, setImages] = useState([]);
  const [step, setStep] = useState("form");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !matchDate || images.length === 0) {
      return;
    }

    try {
      const formData = new FormData();

      const requestData = {
        title: title,
        matchDate: matchDate,
        isOfficial: isOfficial,
      };

      const jsonBlob = new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      });
      formData.append("request", jsonBlob, "request.json");
      Array.from(images).forEach((file) => {
        formData.append("images", file);
      });

      const token = localStorage.getItem("Authorization");

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
        setStep("success");
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Gallery Create Error:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleSuccessClose = () => {
    onSuccess();
  };

  if (step === "success") {
    return (
      <div className="modal-overlay" onClick={handleSuccessClose}>
        <div
          className="modal-success-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-btn" onClick={handleSuccessClose}>
            &times;
          </button>
          <h3 className="success-title">저장되었습니다</h3>
          <button className="submit-btn" onClick={handleSuccessClose}>
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="gallery-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          <div className="upload-area">
            {images.length > 0 ? (
              <div className="image-preview-container">
                {Array.from(images).map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="preview-img"
                  />
                ))}
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="camera-icon"></div>
                <span>사진 올리기</span>
                <span style={{ fontSize: "12px", color: "#bbb" }}>0/5</span>
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 5) {
                  alert("사진은 최대 5장까지 올릴 수 있습니다.");
                  e.target.value = "";
                  return;
                }
                setImages(e.target.files);
              }}
              className="file-input"
            />
          </div>

          <div className="row-group">
            <div className="input-group">
              <label>날짜</label>
              <input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                readOnly={isOfficial}
              />
            </div>
            <div className="input-group">
              <label>이름</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                readOnly={isOfficial}
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={images.length === 0}
          >
            저장
          </button>
        </form>
      </div>
    </div>
  );
};

export default GalleryUploadModal;
