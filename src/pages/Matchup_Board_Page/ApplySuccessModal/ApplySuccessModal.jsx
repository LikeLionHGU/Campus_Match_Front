import "./ApplySuccessModal.css";
import closeIcon from "../../../assets/close.svg"

const ApplySuccessModal = ({ onConfirm }) => {
  return (
    <div className="apply-success-modal-backdrop">
      <div className="apply-success-modal">
        <img
          src={closeIcon}
          alt="close"
          className="apply-success-modal-close"
          onClick={onConfirm}
        />

        <div className="apply-success-modal-text">
            매치업 신청이 완료되었습니다!
        </div>
        <span className="apply-success-modal-span">
            신청 기록은 대시보드 &gt; 제안한 매치업에서 확인하실 수 있습니다.
        </span>

        <button
          className="apply-success-modal-button"
          onClick={onConfirm}
        >
          확인
        </button>

      </div>
    </div>
  );
};

export default ApplySuccessModal;