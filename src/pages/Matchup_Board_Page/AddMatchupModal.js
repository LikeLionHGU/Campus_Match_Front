import { useState } from "react";
import "./MatchupCancelModal.css";
import closeIcon from "../../../../../../assets/close.svg";

const MatchupCancelModal = ({onClose ,onSuccess}) =>{
    const [reason, setReason] = useState("");
    const handleCancelConfirm = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_HOST_URL}/api/matchPost/`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: localStorage.getItem("Authorization"),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
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
    return(
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
                            <div>
                                <span>종목</span>     
                                <input/>
                            </div>
                            <div>
                                <span>날짜</span>
                                <input/>
                            </div>
                            <div>
                                <span>장소</span>
                                <input/>
                            </div>
                            <div>
                                <span>가능 시간</span>
                                <input/>
                                ~
                                <input/>
                            </div>
                            <div>
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
                            <button className="add-matchup-right-button" onClick={handleCancelConfirm}>확인</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
export default MatchupCancelModal;