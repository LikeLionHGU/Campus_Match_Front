import "./MatchupCalenderModal.css";

const MatchupCalenderModal = ({ onClose }) => {
  return (
    <div className="matchup-calender-modal-backdrop" onClick={onClose}>
      <div
        className="matchup-calender-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Matchup Calender Modal</h2>
      </div>
    </div>
  );
};

export default MatchupCalenderModal;
