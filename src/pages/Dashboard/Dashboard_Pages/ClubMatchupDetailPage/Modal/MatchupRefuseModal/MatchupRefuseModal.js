import { useState } from "react";
import "./MatchupRefuseModal.css";
import closeIcon from "../../../../../../assets/close.svg";

const MatchupRefuseModal = ({
  onClose,
  onSuccess,
  type,
  matchRequestId,
  message,
}) => {
  const [reason, setReason] = useState("");
  const handleCancelConfirm = async () => {
    try {
      const url =
        type === "send"
          ? `${process.env.REACT_APP_HOST_URL}/api/matchRequest/send/${matchRequestId}`
          : `${process.env.REACT_APP_HOST_URL}/api/matchRequest/receive/${matchRequestId}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("Authorization"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: reason,
        }),
      });

      if (!res.ok) throw new Error();

      onSuccess();
    } catch (e) {
      console.error("cancel fail", e);
    }
  };
  return (
    <>
      <div className="matchup-cancel-modal-backdrop" onClick={onClose}>
        <div
          className="matchup-cancel-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={closeIcon}
            alt="close"
            className="matchup-cancel-modal-close"
            onClick={onClose}
          />
          <div className="matchup-cancel-modal-main">
            <div className="matchup-cancel-modal-header">
              <span>{message}</span>
            </div>
            <div className="matchup-cancel-modal-body">
              <span>사유</span>
              <div>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={200}
                />

                <div className="typing-count">{reason.length} / 200</div>
              </div>
            </div>
            <div className="matchup-cancel-modal-button">
              <button className="matchup-cancel-left-button" onClick={onClose}>
                취소
              </button>
              <button
                className="matchup-cancel-right-button"
                onClick={handleCancelConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchupRefuseModal;
