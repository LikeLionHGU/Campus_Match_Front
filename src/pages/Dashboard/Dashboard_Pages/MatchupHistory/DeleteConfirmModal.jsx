import React from "react";
import "./DeleteConfirmModal.css";

const DeleteConfirmModal = ({ matchHistoryId, onClose, onSuccess }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("Authorization");

      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/matchHistory/${matchHistoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token || "",
          },
        },
      );

      if (response.ok) {
        onSuccess();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div
        className="delete-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-title">정말 삭제하시겠습니까?</div>
        <div className="delete-modal-subtitle">
          삭제한 정보는 복구할 수 없습니다.
        </div>

        <div className="delete-modal-buttons">
          <button className="delete-modal-cancel" onClick={onClose}>
            취소
          </button>
          <button className="delete-modal-confirm" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
