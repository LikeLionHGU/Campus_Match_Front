import { useState } from "react";
import "./ApplyMatchupModal.css";
import closeIcon from "../../../assets/close.svg";

const ApplyMatchupModal = ({ onClose, onSuccess, matchPostId, matchDate}) => {

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleApply = async () => {

        if (!startTime || !endTime) {
            
            return;
        }

        try {

            const res = await fetch(
                `${import.meta.env.VITE_HOST_URL}/api/matchRequest/${matchPostId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: localStorage.getItem("Authorization"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        startTime: startTime,
                        endTime: endTime
                    })
                }
            );

            if (!res.ok) throw new Error();
          
            onSuccess();

        } catch (e) {

            console.error("apply matchup fail", e);

        }

    };

    return (
        <div className="apply-matchup-modal-backdrop">
            <div className="apply-matchup-modal">

                <img
                    src={closeIcon}
                    alt="close"
                    className="apply-matchup-close"
                    onClick={onClose}
                />

                <div className="apply-matchup-modal-text">
                    해당 매치업에 신청하시겠습니까?
                </div>
                
                <div className="apply-matchup-modal-date">
                    <span>가능날짜</span>
                    <input
                        value={matchDate}
                        readOnly
                    />
                </div>
                

                <div className="apply-matchup-modal-time">
                    <span>신청시간</span>

                    <div className="apply-matchup-modal-time-inputs">

                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />

                        <span>~</span>

                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            min={startTime || undefined}
                        />

                    </div>
                </div>

                <div className="apply-matchup-modal-button">

                    <button
                        className="apply-matchup-modal-button-cancel"
                        onClick={onClose}
                    >
                        취소
                    </button>

                    <button
                        className="apply-matchup-modal-button-confirm"
                        onClick={handleApply}
                    >
                        신청
                    </button>

                </div>

            </div>
        </div>
    );
};

export default ApplyMatchupModal;
