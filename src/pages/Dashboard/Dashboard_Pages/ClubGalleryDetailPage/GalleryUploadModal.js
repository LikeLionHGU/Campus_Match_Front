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
      const clubId = localStorage.getItem("clubId");

      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/gallery/${clubId}`,
        {
          method: "POST",
          headers: {
            Authorization: token || "",
          },
          body: formData,
        },
      );

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error("Gallery Create Error:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{isOfficial ? "매치업 마무리하기" : "갤러리 생성"}</h3>
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
                <span>사진을 등록해주세요</span>
                <span style={{ fontSize: "12px", color: "#bbb" }}>
                  (최대 5장)
                </span>
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="file-input"
            />
          </div>

          <div className="row-group">
            <div className="input-group">
              <label>이름</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                readOnly={isOfficial} // Prevent editing if official match data
              />
            </div>
            <div className="input-group">
              <label>날짜</label>
              <input
                type="text"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                readOnly={isOfficial} // Prevent editing if official match data
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
