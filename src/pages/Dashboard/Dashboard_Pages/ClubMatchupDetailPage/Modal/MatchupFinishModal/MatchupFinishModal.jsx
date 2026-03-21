import "./MatchupFinishModal.css";
import closeIcon from "../../../../../../assets/close.svg"

const MatchupFinishModal = ({onClose, onSuccess, matchPostId }) =>{

    const handleFinish = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_HOST_URL}/api/matchPost/ongoing/${matchPostId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: localStorage.getItem("Authorization"),
                    },
                }
            );

            if (!res.ok) throw new Error();

            onSuccess();

        } catch (e) {
            console.error("finish matchup fail", e);
        }
    };
    return(
        <>
            <div className="matchup-finish-modal-backdrop">
                <div className="matchup-finish-modal">
                    <img
                    src={closeIcon}
                    alt="close"
                    className="matchup-finish-close"
                    onClick={onClose}
                    />

                    <div className="matchup-finish-modal-text">
                    해당 매치업을 종료 하시겠습니까?
                    </div>

                    <div className="matchup-finish-modal-button">
                        <button
                        className="matchup-finish-modal-button-cancel"
                        onClick={onClose}
                        >
                        취소
                        </button>
                        <button
                        className="matchup-finish-modal-button-confirm"
                        onClick={handleFinish}
                        >
                        확인
                        </button>
                    </div>
                    

                </div>
                </div>
        </>
    );
}

export default MatchupFinishModal;