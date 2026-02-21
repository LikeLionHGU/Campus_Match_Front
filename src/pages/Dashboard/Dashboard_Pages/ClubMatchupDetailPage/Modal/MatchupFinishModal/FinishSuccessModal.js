import "./FinishSuccessModal.css";
import closeIcon from "../../../assets/close.svg"

const FinishSuccessModal = ({ onConfirm }) => {
  return (
    <div className="finish-success-modal-backdrop">
      <div className="finish-success-modal">
        <img
          src={closeIcon}
          alt="close"
          className="finish-success-modal-close"
          onClick={onConfirm}
        />

        <div className="finish-success-modal-text">
            매치업이 종료되었습니다
        </div>
        <span className="finish-success-modal-span">
            종료된 매치업에서 매치업을 마무리해주세요
        </span>

        <button
          className="finish-success-modal-button"
          onClick={onConfirm}
        >
          확인
        </button>

      </div>
    </div>
  );
};

export default FinishSuccessModal;