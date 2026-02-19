import { useState, useEffect } from "react";
import "./ClubSearchModal.css";
import closeIcon from "../../../assets/close.svg";

const ClubSearchModal = ({ filters, setFilters, onClose }) => {

    const [tempRegions, setTempRegions] = useState([]);
    const [tempSports, setTempSports] = useState([]);

    useEffect(() => {
        setTempRegions(filters.regions || []);
        setTempSports(filters.sports || []);
    }, [filters]);

    const toggleRegion = (value) => {
        setTempRegions((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const toggleSport = (value) => {
        setTempSports((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const handleConfirm = () => {
        setFilters({
            regions: tempRegions,
            sports: tempSports,
        });

        onClose();
    };

    const regions = [
        "경기","경남","경북","광주","대전","대구","부산","서울"
        // ,"세종","인천","전남","전북","제주","충남","충북"
    ];

    const sports = [
        "골프","검도","당구","등산",
        "레슬링","러닝","무에타이","복싱",
        "사이클","수영","양궁","야구",
        "유도","주짓수","족구","축구",
        "킥복싱","탁구","테니스","티볼",
        "풋살","농구","배구","미식축구",
        "e스포츠","MMA"
    ];

    return (
        <div className="club-search-modal-backdrop" onClick={onClose}>
            <div className="club-search-modal" onClick={(e) => e.stopPropagation()}>

                <div className="club-search-filter-modal">

                    <img
                        src={closeIcon}
                        alt="close"
                        className="club-search-modal-close"
                        onClick={onClose}
                    />


                    <div className="club-search-filter-section">
                        <div className="club-search-filter-title">지역</div>

                        <div className="club-search-filter-options-region">
                            {regions.map((region) => (
                                <label key={region}>
                                    <input
                                        type="checkbox"
                                        checked={tempRegions.includes(region)}
                                        onChange={() => toggleRegion(region)}
                                    />
                                    {region}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="club-search-filter-section">
                        <div className="club-search-filter-title">종목</div>

                        <div className="club-search-filter-options">
                            {sports.map((sport) => (
                                <label key={sport}>
                                    <input
                                        type="checkbox"
                                        checked={tempSports.includes(sport)}
                                        onChange={() => toggleSport(sport)}
                                    />
                                    {sport}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="club-search-filter-footer">
                        <button
                            className="club-search-confirm-btn"
                            onClick={handleConfirm}
                        >
                            확인
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ClubSearchModal;
