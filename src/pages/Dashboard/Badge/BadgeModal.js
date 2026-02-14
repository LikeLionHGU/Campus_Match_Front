 import "./BadgeModal.css";
import Badge_list from "../../../assets/badge_list.svg";
import closeIcon from "../../../assets/close.svg"

const BadgeModal = ({ onClose }) => {
  return (
    <div className="badge-modal-backdrop" onClick={onClose}>
      <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
        <img
          src={closeIcon}
          alt="close"
          className="badge-modal-close"
          onClick={onClose}
        />
        <div className="badge-modal-text">배지 목록</div>
        <img src={Badge_list} alt="배지리스트"/>
      </div>
    </div>
  );
};
 
export default BadgeModal;