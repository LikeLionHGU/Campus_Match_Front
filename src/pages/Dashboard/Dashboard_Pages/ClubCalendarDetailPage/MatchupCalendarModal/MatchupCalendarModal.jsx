import "./MatchupCalendarModal.css";

const MatchupCalendarModal = ({ onClose }) => {
  return (
    <div className="matchup-calendar-modal-backdrop" onClick={onClose}>
      <div
        className="matchup-calendar-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Matchup Calendar Modal</h2>
      </div>
    </div>
  );
};

export default MatchupCalendarModal;
