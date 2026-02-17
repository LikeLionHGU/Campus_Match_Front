import "./MatchupAcceptModal.css";
import closeIcon from "../../../../../../assets/close.svg"

const MatchupAcceptModal = ({onConfirm,matchPostId}) => {
    return (
    <div className="accept-modal-backdrop">
      <div className="accept-modal">
        <img
          src={closeIcon}
          alt="close"
          className="accept-modal-close"
          onClick={onConfirm}
        />

        <div className="accept-modal-text">
            수락되었습니다
        </div>

        <div className="accept-modal-text-sub">
            예정된 매치업에서 확인해보세요
        </div>

        <button
          className="accept-modal-button"
          onClick={onConfirm}
        >
          확인
        </button>

      </div>
    </div>
  );
}

export default MatchupAcceptModal;