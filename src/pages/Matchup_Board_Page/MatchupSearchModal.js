import { useState, useEffect } from "react";
import "./MatchupSearchModal.css";
import closeIcon from "../../assets/close.svg"

const MatchupSearchModal = ({ filters, setFilters, onClose }) => {


    const [tempRegions, setTempRegions] = useState([]);
    const [tempSports, setTempSports] = useState([]);
    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);


    useEffect(() => {
        setTempRegions(filters.regions || []);
        setTempSports(filters.sports || []);
        setTempStartDate(filters.startDate || null);
        setTempEndDate(filters.endDate || null);
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
            startDate: tempStartDate,
            endDate: tempEndDate,
        });

        onClose();
    };

 
    const regions = [
        "강원","경기","경남","경북",
        "광주","대전","대구","부산",
        "서울","세종","울산","인천",
        "전남","전북","제주","충남",
        "충북"
    ];

    const sports = [
        "검도","골프","농구","당구",
        "등산","러닝","레슬링","미식축구",
        "무에타이","배구","복싱","사이클",
        "수영","야구","양궁","유도",
        "족구","주짓수","축구","탁구",
        "태권도","테니스","티볼","풋살",
        "e스포츠","MMA"
    ];

    return (
        <div className="matchup-search-modal-backdrop" onClick={onClose}>
            <div className="matchup-search-modal" onClick={(e) => e.stopPropagation()}>

                <div className="matchup-search-filter-modal">
                    <img
                        src={closeIcon}
                        alt="close"
                        className="matchup-search-modal-close"
                        onClick={onClose}
                    />
                    <div className="matchup-search-filter-section">
                        <div className="matchup-search-filter-title">지역</div>

                        <div className="matchup-search-filter-options-region">
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

                    <div className="matchup-search-filter-section">
                        <div className="matchup-search-filter-title">종목</div>

                        <div className="matchup-search-filter-options">
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

                    <div className="matchup-search-filter-section">
                        <div className="matchup-search-filter-title">날짜</div>

                        <div className="matchup-search-filter-date">
                            <input
                                type="date"
                                value={tempStartDate || ""}
                                onChange={(e) => setTempStartDate(e.target.value)}
                                placeholder="0000"
                            />
                            <span>~</span>
                            <input
                                type="date"
                                value={tempEndDate || ""}
                                onChange={(e) => setTempEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="matchup-search-filter-footer">
                        <button className="matchup-search-confirm-btn" onClick={handleConfirm}>
                            확인
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MatchupSearchModal;
