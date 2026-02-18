import Sidebar from "../../components/SideBar/SideBar";
import "./MatchupBoardPage.css";
import { useState, useEffect, useCallback } from "react";
import ArrowLeft from "../../assets/arrow_left.svg";
import ArrowLeftDouble from "../../assets/arrow_left_double.svg";
import ArrowRight from "../../assets/arrow_right.svg";
import ArrowRightDouble from "../../assets/arrow_right_double.svg";
import ArrowDown from "../../assets/arrow_down_primary.svg";
import MatchupSearchModal from "./MatchupSearchModal";
import SearchIcon from "../../assets/search.svg";
import ArrowDownGray from "../../assets/arrow_down_gray.svg";
import ResetIcon from "../../assets/reset.svg";
import CloseIcon from "../../assets/close.svg";
import DefaultClubIcon from "../../assets/Main_Icon_Gray.svg";
import AddMatchupModal from "./AddMatchupModal";
import SuccessModal from "../Dashboard/Dashboard_Pages/ClubCalenderDetailPage/SuccessModal/SuccessModal";

const MatchupBoardPage = () => {

    const [matchups, setMatchups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dateOrder, setDateOrder] = useState("asc");

    // const [detailModalOpen, setDetailModalOpen] = useState(false);
    // const [selectedMatchId, setSelectedMatchId] = useState(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [filter, setFilter] = useState("all");
    const [keyword, setKeyword] = useState("");

    const [filters, setFilters] = useState({
        regions: [],
        sports: [],
        startDate: null,
        endDate: null,
    });

    const displayFilters = [
        ...filters.regions.map(r => ({
            type: "region",
            label: r,
            value: r
        })),
        ...filters.sports.map(s => ({
            type: "sport",
            label: s,
            value: s
        })),
        ...(filters.startDate || filters.endDate
            ? [{ type: "date", label: "날짜" }]
            : []
        )
    ];

    const sortedMatchups = [...matchups].sort((a, b) => {
        const dateA = new Date(a.matchDate);
        const dateB = new Date(b.matchDate);

        return dateOrder === "asc"
            ? dateA - dateB
            : dateB - dateA;
    });

    const pageSize = 10;

    const fetchMatchups = useCallback(async () => {
        try {
            const params = new URLSearchParams();

            if (filter !== "all") {
                params.append("type", filter);
            }

            if (keyword.trim() !== "") {
                params.append("keyword", keyword);
            }

            if (filters.regions.length > 0) {
                params.append("regions", filters.regions.join(","));
            }

            if (filters.sports.length > 0) {
                params.append("sports", filters.sports.join(","));
            }

            if (filters.startDate) {
                params.append("startDate", filters.startDate);
            }

            if (filters.endDate) {
                params.append("endDate", filters.endDate);
            }

            const res = await fetch(
                `${process.env.REACT_APP_HOST_URL}/api/matchPost`,
                {
                    headers: {
                        Authorization: localStorage.getItem("Authorization"),
                    },
                }
            );

            if (!res.ok) throw new Error();

            const data = await res.json();

            setMatchups(Array.isArray(data) ? data : data.List || []);
            setCurrentPage(1);

        } catch (e) {
            console.error("matchup load fail", e);
        }
    }, [filter, keyword, filters]);

    useEffect(() => {
        fetchMatchups();
    }, [fetchMatchups]);

    const totalPages = Math.max(1, Math.ceil(matchups.length / pageSize));

    const pagedMatchups = sortedMatchups.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const goFirstBlock = () => {
        setCurrentPage((prev) => Math.max(1, prev - 10));
    };

    const goPrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const goNext = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    const goLastBlock = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 10));
    };
    

    return (
        <>
            <div className="container">
                <div className="sidebar">
                    <Sidebar />
                </div>

                <div className="matchup-board-container">
                    <div className="matchup-board-header">
                        <div className="matchup-board-header-search">

                            <div className="matchup-board-header-dropdown">
                                <div
                                    className={`dropdown-selected ${dropdownOpen ? "open" : ""}`}
                                    onClick={() => setDropdownOpen(prev => !prev)}
                                >
                                    {filter === "all" && "전체"}
                                    {filter === "mine" && "내가 쓴 매치업"}
                                    {filter === "others" && "다른 사람이 쓴 매치업"}
                                    <img
                                        src={ArrowDown}
                                        alt="arrow"
                                        className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}
                                    />
                                </div>

                                {dropdownOpen && (
                                    <ul className="dropdown-list">
                                        <li
                                            onClick={() => {
                                                setFilter("all");
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            전체
                                        </li>

                                        <li
                                            onClick={() => {
                                                setFilter("mine");
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            내가 쓴 매치업
                                        </li>

                                        <li
                                            onClick={() => {
                                                setFilter("others");
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            다른 사람이 쓴 매치업
                                        </li>
                                    </ul>
                                )}
                            </div>

                            <div className="matchup-board-header-search-input">
                                <input
                                    type="text"
                                    placeholder="검색"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                                <img src={SearchIcon} alt="search" />
                            </div>

                            <div
                                className="matchup-board-search-condition"
                                
                            >
                                <div className="matchup-board-search-condition-left"
                                    onClick={() => setSearchModalOpen(true)}
                                >
                                    검색조건
                                    <img src={ArrowDownGray} alt="arrow_down" />
                                </div>

                                <div className="matchup-board-search-condition-middle">
                                    {displayFilters.map((item, idx) => (
                                        <div className="matchup-board-filter-chip" key={idx}>
                                            <span className="filter-chip-text">{item.label}</span>

                                            <div
                                                className="filter-chip-remove"
                                                onClick={(e) => {
                                                e.stopPropagation();

                                                if (item.type === "region") {
                                                    setFilters(prev => ({
                                                    ...prev,
                                                    regions: prev.regions.filter(r => r !== item.value)
                                                    }));
                                                }

                                                if (item.type === "sport") {
                                                    setFilters(prev => ({
                                                    ...prev,
                                                    sports: prev.sports.filter(s => s !== item.value)
                                                    }));
                                                }

                                                if (item.type === "date") {
                                                    setFilters(prev => ({
                                                    ...prev,
                                                    startDate: null,
                                                    endDate: null
                                                    }));
                                                }
                                                }}
                                            >
                                                <img src={CloseIcon} alt="remove" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    className="matchup-board-search-condition-right"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilters({
                                            regions: [],
                                            sports: [],
                                            startDate: null,
                                            endDate: null,
                                        });
                                    }}
                                >
                                    검색초기화
                                    <img src={ResetIcon} alt="reset" />
                                </div>
                            </div>

                        </div>

                        <div className="matchup-board-header-add">
                            <button onClick={()=>setAddModalOpen(true)}>매치업 등록</button>
                        </div>
                    </div>

                    <div className="matchup-board-main">
                        <div className="matchup-board-content">
                            <div className="matchup-board-table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                <div
                                                    className="thead-date"
                                                    onClick={() =>
                                                        setDateOrder((prev) =>
                                                            prev === "asc" ? "desc" : "asc"
                                                        )
                                                    }
                                                >
                                                    <span>날짜</span>
                                                    <img
                                                        className={dateOrder === "desc" ? "rotate" : ""}
                                                        src={ArrowDown}
                                                        alt="down_arrow"
                                                    />
                                                </div>
                                            </th>
                                            <th>종목</th>
                                            <th>동아리/대학</th>
                                            <th>지역</th>
                                            <th>장소</th>
                                            <th>매치온도</th>
                                            <th>세부 정보</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {pagedMatchups.map((item) => (
                                            <tr key={item.matchId}>
                                                <td>{item.matchDate}</td>
                                                <td>{item.sportCategory}</td>
                                                <td>
                                                    <div>
                                                        <img className="club-small-icon" src={item.imageUrl || DefaultClubIcon} alt="club-icon" />
                                                        <span>
                                                            {item.clubName}/{item.university}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>{item.region}</td>
                                                <td>{item.location}</td>
                                                <td>{item.mannerScore}°C</td>
                                                <td>
                                                    <div>
                                                        <button
                                                            // onClick={() => {
                                                            //     setSelectedMatchId(item.matchPostId);
                                                            //     setDetailModalOpen(true);
                                                            // }}
                                                        >
                                                            세부정보
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="matchup-board-pagination">
                                <div className="pagination-move">
                                    <img
                                        className="matchup-board-pagination-double"
                                        src={ArrowLeftDouble}
                                        alt="<<"
                                        onClick={goFirstBlock}
                                    />
                                    <img
                                        className="matchup-board-pagination-mono"
                                        src={ArrowLeft}
                                        alt="<"
                                        onClick={goPrev}
                                    />
                                </div>

                                <div className="pagination-numbers">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            className={currentPage === i + 1 ? "active" : ""}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <div className="pagination-move">
                                    <img
                                        className="matchup-board-pagination-mono"
                                        src={ArrowRight}
                                        alt=">"
                                        onClick={goNext}
                                    />
                                    <img
                                        className="matchup-board-pagination-double"
                                        src={ArrowRightDouble}
                                        alt=">>"
                                        onClick={goLastBlock}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {searchModalOpen && (
                <MatchupSearchModal
                    filters={filters}
                    setFilters={setFilters}
                    onClose={() => setSearchModalOpen(false)}
                />
            )}
            {addModalOpen && (
                <AddMatchupModal              
                    onClose={() => setAddModalOpen(false)}
                    onSuccess={()=>{
                        setAddModalOpen(false);
                        setSuccessModalOpen(true);
                        fetchMatchups();
                    }}
                />
            )}
            {/* {detailModalOpen && (
                <AddMatchupModal              
                    onClose={() => setAddModalOpen(false)}
                    onSuccess={()=>{
                        setAddModalOpen(false);
                        setSuccessModalOpen(true);
                        fetchMatchups();
                    }}
                />
            )} */}
            {successModalOpen && (
                <SuccessModal
                    message="매치업이 등록되었습니다"
                    onConfirm={() => setSuccessModalOpen(false)}
                    
                />
            )} 
        </>
    );
};

export default MatchupBoardPage;
