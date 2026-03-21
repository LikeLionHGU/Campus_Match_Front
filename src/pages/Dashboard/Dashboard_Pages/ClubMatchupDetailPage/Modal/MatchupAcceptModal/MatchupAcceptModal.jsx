import "./MatchupAcceptModal.css";
import closeIcon from "../../../../../../assets/close.svg";

const MatchupAcceptModal = ({ onConfirm, onClose, matchRequestId }) => {
  const handleAccept = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/matchRequest/receive/${matchRequestId}`,
        {
          method: "PUT",
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        },
      );

      if (res.ok) {
        onConfirm();
      } else {
        alert("수락 실패");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="accept-modal-backdrop">
      <div className="accept-modal">
        <img
          src={closeIcon}
          alt="close"
          className="accept-modal-close"
          onClick={onClose}
        />

        <div className="accept-modal-text">수락되었습니다</div>

        <div className="accept-modal-text-sub">
          예정된 매치업에서 확인해보세요
        </div>

        <button className="accept-modal-button" onClick={handleAccept}>
          확인
        </button>
      </div>
    </div>
  );
};

export default MatchupAcceptModal;
