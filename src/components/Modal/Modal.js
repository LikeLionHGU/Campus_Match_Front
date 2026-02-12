import "./Modal.css";

export default function Modal({
  isOpen,
  message,
  subtitle = "",
  onConfirm,
  onCancel,
  showCancel = false,
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        {subtitle && <p className="modal-subtitle">{subtitle}</p>}
        <div className="modal-buttons">
          {showCancel && (
            <button className="modal-btn cancel" onClick={handleCancel}>
              취소
            </button>
          )}
          <button className="modal-btn confirm" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
