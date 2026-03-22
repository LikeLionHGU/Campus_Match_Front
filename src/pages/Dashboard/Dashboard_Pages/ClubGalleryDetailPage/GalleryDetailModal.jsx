import React, { useState } from "react";
import MainLogo from "../../../../assets/mainLogo.png";
import "./GalleryDetailModal.css";
import closeIcon from "../../../../assets/close.svg";

const GalleryDetailModal = ({ item, onClose, onUpdate }) => {
  const [title, setTitle] = useState(item.title);
  const [matchDate, setMatchDate] = useState(item.matchDate);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [step, setStep] = useState("detail");

  console.log("Gallery Detail Modal Item Data:", item); // for debugging backend response

  let extractedList = [];
  if (Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
    extractedList = item.imageUrls;
  } else if (item.imageUrls && typeof item.imageUrls === "string") {
    // fallback if it comes as a comma separated string
    extractedList = item.imageUrls.split(",").filter(Boolean);
  } else if (Array.isArray(item.images) && item.images.length > 0) {
    extractedList = item.images;
  } else if (Array.isArray(item.imageList) && item.imageList.length > 0) {
    extractedList = item.imageList;
  } else if (
    Array.isArray(item.galleryImages) &&
    item.galleryImages.length > 0
  ) {
    extractedList = item.galleryImages;
  } else if (item.imageUrl) {
    extractedList = [item.imageUrl];
  }

  const imageList = extractedList;

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : imageList.length - 1,
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev < imageList.length - 1 ? prev + 1 : 0,
    );
  };

  const handleDeleteClick = () => {
    setStep("delete_confirm");
  };

  const executeDelete = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/gallery/${item.galleryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token || "",
          },
        },
      );

      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Delete Error", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const formData = new FormData();
      const requestData = { title, matchDate };
      const jsonBlob = new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      });
      formData.append("request", jsonBlob, "request.json");

      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/gallery/${item.galleryId}`,
        {
          method: "PUT",
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
      console.error("Update Error", error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleSuccessClose = () => {
    onUpdate();
    onClose();
  };

  if (step === "success") {
    return (
      <div className="gd-overlay" onClick={handleSuccessClose}>
        <div
          className="gd-success-content"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={closeIcon}
            alt="close"
            className="gd-close-btn"
            onClick={handleSuccessClose}
          />
          <div className="gd-success-title">저장되었습니다</div>
          <button className="gd-confirm-btn" onClick={handleSuccessClose}>
            확인
          </button>
        </div>
      </div>
    );
  }

  if (step === "delete_confirm") {
    return (
      <div className="gd-overlay" onClick={() => setStep("detail")}>
        <div
          className="gd-success-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="gd-success-title" style={{ marginTop: "1.042vw" }}>
            정말 삭제하시겠습니까?
          </div>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "1.042vw",
              fontSize: "0.729vw",
              fontFamily: "Pretendard",
            }}
          >
            삭제된 항목은 복구할 수 없습니다.
          </p>
          <div
            style={{ display: "flex", gap: "0.521vw", justifyContent: "center" }}
          >
            <button
              className="gd-confirm-btn"
              style={{ backgroundColor: "#ccc" }}
              onClick={() => setStep("detail")}
            >
              취소
            </button>
            <button className="gd-confirm-btn" onClick={executeDelete}>
              삭제
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gd-overlay" onClick={onClose}>
      <div className="gd-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={closeIcon}
          alt="close"
          className="gd-close-btn"
          onClick={onClose}
        />

        <div className="gd-image-area">
          {imageList.length > 1 && (
            <div className="gd-pagination">
              <button className="gd-page-arrow" onClick={handlePrev}>
                &lt;
              </button>
              <span className="gd-page-number">
                {currentImageIndex + 1}/{imageList.length}
              </span>
              <button className="gd-page-arrow" onClick={handleNext}>
                &gt;
              </button>
            </div>
          )}

          {item.isOfficial && (
            <img src={MainLogo} alt="Official" className="gd-official-logo" />
          )}

          {imageList.length > 0 ? (
            <img
              src={imageList[currentImageIndex]}
              alt={title}
              className="gd-image"
            />
          ) : (
            <div className="gd-no-image">이미지 없음</div>
          )}
        </div>

        <div className="gd-info-row">
          <div className="gd-field">
            <label>날짜</label>
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
            />
          </div>
          <div className="gd-field">
            <label>이름</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="gd-button-group">
          <button className="gd-btn gd-btn-delete" onClick={handleDeleteClick}>
            삭제
          </button>
          <button className="gd-btn gd-btn-save" onClick={handleUpdate}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetailModal;
