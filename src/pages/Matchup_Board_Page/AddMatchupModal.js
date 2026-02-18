import { useState } from "react";
import "./AddMatchupModal.css";
import closeIcon from "../../assets/close.svg";
import ArrowDown from "../../assets/arrow_down_gray.svg"

const AddMatchupModal = ({ onClose, onSuccess }) => {
    const [sportCategory, setSportCategory] = useState("");
    const [matchDate, setMatchDate] = useState("");
    const [location, setLocation] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [reason, setReason] = useState("");
    const [sportDropdownOpen, setSportDropdownOpen] = useState(false);
    
    const sportList = [
        "골프","검도","당구","등산",
        "레슬링","러닝","무에타이","복싱",
        "사이클","수영","양궁","야구",
        "유도","주짓수","족구","축구",
        "킥복싱","탁구","테니스","티볼",
        "풋살","농구","배구","미식축구",
        "e스포츠","MMA"
    ];
    const handleAddConfirm = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_HOST_URL}/api/matchPost`,
                {
                    method: "POST",
                    headers: {
                        Authorization: localStorage.getItem("Authorization"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sportCategory: sportCategory,
                        matchDate: matchDate,
                        location: location,
                        startTime: startTime,
                        endTime: endTime,
                        content: reason,
                    }),
                }
            );

            if (!res.ok) throw new Error();

            onSuccess();

        } catch (e) {
            console.error("cancel fail", e);
        }
    };

    return (
        <>
            <div className="add-matchup-modal-backdrop" onClick={onClose}>
                <div className="add-matchup-modal" onClick={(e) => e.stopPropagation()}>
                    <img
                        src={closeIcon}
                        alt="close"
                        className="add-matchup-modal-close"
                        onClick={onClose}
                    />
                    <div className="add-matchup-modal-main">
                        <div className="add-matchup-modal-header">
                            <span>매치업 등록하기 </span>
                        </div>
                        <div className="add-matchup-modal-body">
                            <div className="add-matchup-modal-category">
                                <span>종목</span>

                                <div className="add-matchup-sport-dropdown">
                                    <div
                                        className="add-matchup-sport-dropdown-selected"
                                        onClick={() => setSportDropdownOpen(prev => !prev)}
                                    >
                                        {sportCategory || "종목 선택"}
                                        <img src={ArrowDown} alt="arrow" />
                                    </div>

                                    {sportDropdownOpen && (
                                        <ul className="add-matchup-sport-dropdown-list">
                                            {sportList.map((sport) => (
                                                <li
                                                    key={sport}
                                                    onClick={() => {
                                                        setSportCategory(sport);
                                                        setSportDropdownOpen(false);
                                                    }}
                                                >
                                                    {sport}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="add-matchup-modal-date">
                                <span>날짜</span>
                                <input
                                    type="date"
                                    value={matchDate}
                                    onChange={(e) => setMatchDate(e.target.value)}
                                />
                            </div>

                            <div className="add-matchup-modal-place">
                                <span>장소</span>
                                <div>
                                    <input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        readOnly
                                    />
                                    <button>찾기</button>
                                </div>
                                
                            </div>

                            <div className="add-matchup-modal-time">
                                <span>가능 시간</span>
                                <div>
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
                                    />
                                </div>
                                
                            </div>
                            <div className="add-matchup-modal-content">
                                <span>상세 내용</span>
                                <div>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        maxLength={200}
                                    />
                                    <div className="typing-count">
                                        {reason.length} / 200
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="add-matchup-modal-button">
                            <button className="add-matchup-left-button" onClick={onClose}>취소</button>
                            <button className="add-matchup-right-button" onClick={handleAddConfirm}>확인</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddMatchupModal;
