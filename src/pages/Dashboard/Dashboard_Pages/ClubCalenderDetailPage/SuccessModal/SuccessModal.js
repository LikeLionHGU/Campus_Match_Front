import "./SuccessModal.css";
import closeIcon from "../../../../../assets/close.svg"

const SuccessModal = ({ message, onConfirm }) => {
  return (
    <div className="success-modal-backdrop">
      <div className="success-modal">
        <img
          src={closeIcon}
          alt="close"
          className="success-modal-close"
          onClick={onConfirm}
        />

        <div className="success-modal-text">
          {message}
        </div>

        <button
          className="success-modal-button"
          onClick={onConfirm}
        >
          확인
        </button>

      </div>
    </div>
  );
};

export default SuccessModal;