import "./DeleteMatchupModal.css";
import closeIcon from "../../../assets/close.svg";

const DeleteMatchupModal = ({ onClose, onSuccess, matchPostId }) => {

    const handleDelete = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_HOST_URL}/api/matchPost/${matchPostId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: localStorage.getItem("Authorization"),
                    },
                }
            );
            console.log(matchPostId);
            if (!res.ok) throw new Error();
            
            onSuccess();

        } catch (e) {
            console.error("delete matchup fail", e);
        }
    };

    return (
        <>
            <div className="delete-matchup-modal-backdrop">
                <div className="delete-matchup-modal">

                    <img
                        src={closeIcon}
                        alt="close"
                        className="delete-matchup-close"
                        onClick={onClose}
                    />

                    <div className="delete-matchup-modal-text">
                        매치업을 삭제하시겠습니까?
                    </div>

                    <div className="delete-matchup-modal-button">

                        <button
                            className="delete-matchup-modal-button-cancel"
                            onClick={onClose}
                        >
                            취소
                        </button>

                        <button
                            className="delete-matchup-modal-button-confirm"
                            onClick={handleDelete}
                        >
                            삭제
                        </button>

                    </div>

                </div>
            </div>
        </>
    );
};

export default DeleteMatchupModal;