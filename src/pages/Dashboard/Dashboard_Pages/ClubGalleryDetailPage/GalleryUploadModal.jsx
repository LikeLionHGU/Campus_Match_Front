import React, { useState } from "react";
import "./GalleryUploadModal.css";
import closeIcon from "../../../../assets/close.svg";

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
        `${import.meta.env.VITE_HOST_URL}/api/gallery`,
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
          <img
            src={closeIcon}
            alt="close"
            className="close-btn"
            onClick={handleSuccessClose}
          />
          <div className="success-title">저장되었습니다</div>
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
        <img
          src={closeIcon}
          alt="close"
          className="close-btn"
          onClick={onClose}
        />

        <form onSubmit={handleSubmit}>
          <div className="upload-area">
            {images.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  padding: "0.781vw",
                  boxSizing: "border-box",
                }}
              >
                <div
                  className="image-preview-container"
                  style={{ flex: 1, minHeight: 0, padding: 0 }}
                >
                  {Array.from(images).map((file, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        height: "100%",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="preview-img"
                      />
                      <button
                        type="button"
                        style={{
                          position: "absolute",
                          top: "0.26vw",
                          right: "0.26vw",
                          background: "rgba(0,0,0,0.5)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "1.042vw",
                          height: "1.042vw",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.625vw",
                        }}
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
                    className="upload-placeholder"
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      height: "5.208vw",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      border: "2px dashed #ddd",
                      borderRadius: "0.417vw",
                      background: "#fafafa",
                      flexShrink: 0,
                      pointerEvents: "auto",
                      marginTop: "0.781vw",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="camera-icon"
                      style={{ marginBottom: "0.417vw" }}
                    ></div>
                    <span>추가하기</span>
                    <span style={{ fontSize: "0.625vw", color: "#bbb" }}>
                      {images.length}/5
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files);
                        setImages((prev) => {
                          const combined = [...prev, ...newFiles];
                          if (combined.length > 5) {
                            alert("사진은 최대 5장까지 올릴 수 있습니다.");
                            return combined.slice(0, 5);
                          }
                          return combined;
                        });
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
            ) : (
              <label
                className="upload-placeholder"
                style={{
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  pointerEvents: "auto",
                }}
              >
                <div className="camera-icon"></div>
                <span>사진 올리기</span>
                <span style={{ fontSize: "0.625vw", color: "#bbb" }}>0/5</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    if (newFiles.length > 5) {
                      alert("사진은 최대 5장까지 올릴 수 있습니다.");
                      setImages(newFiles.slice(0, 5));
                    } else {
                      setImages(newFiles);
                    }
                    e.target.value = "";
                  }}
                />
              </label>
            )}
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
