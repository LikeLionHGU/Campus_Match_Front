import Sidebar from "../../components/SideBar/SideBar";
import "./MatchupBoardPage.css";
import { useState, useEffect, useCallback, Fragment } from "react";
import ArrowLeft from "../../assets/arrow_left.svg";
import ArrowLeftDouble from "../../assets/arrow_left_double.svg";
import ArrowRight from "../../assets/arrow_right.svg";
import ArrowRightDouble from "../../assets/arrow_right_double.svg";
import ArrowDown from "../../assets/arrow_down_primary.svg";
import MatchupSearchModal from "./MatchupSearchModal";
import SearchIcon from "../../assets/search.svg";
import DefaultClubIcon from "../../assets/Main_Icon_Gray.svg";
import AddMatchupModal from "./AddMatchupModal/AddMatchupModal";
import SuccessModal from "../Dashboard/Dashboard_Pages/ClubCalenderDetailPage/SuccessModal/SuccessModal";
import DeleteMatchupModal from "./DeleteMatchupModal/DeleteMatchupModal";

const MatchupBoardPage = () => {

    const [matchups, setMatchups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dateOrder, setDateOrder] = useState("asc");

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [filter, setFilter] = useState("all");
    const [keyword, setKeyword] = useState("");

    const [openMatchId, setOpenMatchId] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        regions: [],
        sports: [],
        startDate: null,
        endDate: null,
    });

    // const displayFilters = [
    //     ...filters.regions.map(r => ({
    //         type: "region",
    //         label: r,
    //         value: r
    //     })),
    //     ...filters.sports.map(s => ({
    //         type: "sport",
    //         label: s,
    //         value: s
    //     })),
    //     ...(filters.startDate || filters.endDate
    //         ? [{ type: "date", label: "날짜" }]
    //         : []
    //     )
    // ];

    const sortedMatchups = [...matchups].sort((a, b) => {
        const dateA = new Date(a.matchDate);
        const dateB = new Date(b.matchDate);
        return dateOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    const pageSize = 10;

    const fetchMatchups = useCallback(async () => {
        try {
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
    }, []);

    useEffect(() => {
        fetchMatchups();
    }, [fetchMatchups]);

    const handleToggleDetail = async (matchPostId) => {
        if (openMatchId === matchPostId) {
            setOpenMatchId(null);
            setDetailData(null);
            return;
        }

        setOpenMatchId(matchPostId);
        setDetailLoading(true);

        try {
            const res = await fetch(
                `${process.env.REACT_APP_HOST_URL}/api/matchPost/${matchPostId}`,
                {
                    headers: {
                        Authorization: localStorage.getItem("Authorization"),
                    },
                }
            );

            if (!res.ok) throw new Error();
            const data = await res.json();
            setDetailData(data);
            console.log(data);
        } catch (e) {
            console.error("detail load fail", e);
            setDetailData(null);
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        if (!openMatchId) return;
        if (!window.kakao || !window.kakao.maps) return;

        window.kakao.maps.load(() => {
            const container = document.getElementById(
                `detail-map-${openMatchId}`
            );
            if (!container) return;

            const geocoder = new window.kakao.maps.services.Geocoder();
            console.log(detailData.locationDetail);
            geocoder.addressSearch(detailData.locationDetail, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {

                    const coords = new window.kakao.maps.LatLng(
                        result[0].y,
                        result[0].x
                    );

                    const map = new window.kakao.maps.Map(container, {
                        center: coords,
                        level: 3,
                    });

                    new window.kakao.maps.Marker({
                        map: map,
                        position: coords,
                    });
                }
            });
        });

    }, [detailData,openMatchId]);

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
                                        <li onClick={() => { setFilter("all"); setDropdownOpen(false); }}>
                                            전체
                                        </li>
                                        <li onClick={() => { setFilter("mine"); setDropdownOpen(false); }}>
                                            내가 쓴 매치업
                                        </li>
                                        <li onClick={() => { setFilter("others"); setDropdownOpen(false); }}>
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
                                        {pagedMatchups.map((item) => {
                                            const isOpen = openMatchId === item.matchPostId;

                                            return (
                                                <Fragment key={item.matchPostId}>
                                                    <tr>
                                                        <td>{item.matchDate}</td>
                                                        <td>{item.sportCategory}</td>
                                                        <td>
                                                            <div>
                                                                <img
                                                                    className="club-small-icon"
                                                                    src={item.imageUrl || DefaultClubIcon}
                                                                    alt="club-icon"
                                                                />
                                                                <span>
                                                                    {item.clubName}/{item.university}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>{item.region}</td>
                                                        <td>{item.location}</td>
                                                        <td>{item.mannerScore}°C</td>
                                                        <td>
                                                            <button
                                                                onClick={() =>
                                                                    handleToggleDetail(item.matchPostId)
                                                                }
                                                            >
                                                                세부정보
                                                            </button>
                                                        </td>
                                                    </tr>

                                                    {isOpen && (
                                                        <tr className="accordion-row">
                                                            <td colSpan="7">
                                                                {detailLoading ? (
                                                                    <div>불러오는 중...</div>
                                                                ) : detailData && (
                                                                    <div className="accordion-content">

                                                                        <div className="accordion-content-left">
                                                                            <span className="place-name">
                                                                                {detailData.location}
                                                                            </span>
                                                                            <div
                                                                                id={`detail-map-${openMatchId}`}
                                                                                className="detail-map"
                                                                            />
                                                                        </div>

                                                                        <div className="accordion-content-middle">

                                                                            <div className="accordion-content-middle-time">
                                                                                <span>가능시간</span>
                                                                                <div>
                                                                                    <input readOnly value={detailData.startTime || ""} />
                                                                                    <span>~</span>
                                                                                    <input readOnly value={detailData.endTime || ""} />
                                                                                </div>
                                                                            </div>

                                                                            <div className="accordion-content-middle-phone">
                                                                                <span>전화번호</span>
                                                                                <input readOnly value={detailData.phone || ""} />
                                                                            </div>

                                                                            <div className="accordion-content-middle-content">
                                                                                <span>상세내용</span>
                                                                                <textarea readOnly value={detailData.content || ""} />
                                                                            </div>

                                                                        </div>

                                                                        <div className="accordion-content-right">
                                                                            {detailData.isMine ? (
                                                                                <div className="accordion-content-right-buttons">
                                                                                    <button className="accordion-edit-button">수정하기</button>
                                                                                    <button 
                                                                                        className="accordion-delete-button"
                                                                                        onClick={() => {
                                                                                            setDeleteTargetId(openMatchId);
                                                                                            console.log(deleteTargetId);
                                                                                            setDeleteModalOpen(true);
                                                                                        }}
                                                                                    >삭제하기</button>
                                                                                </div>
                                                                            ) : (
                                                                                <button className="accordion-apply-button">신청하기</button>
                                                                            )}
                                                                        </div>

                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )}

                                                </Fragment>
                                            );
                                        })}
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
            {deleteModalOpen && (
                <DeleteMatchupModal
                    matchPostId={deleteTargetId}
                    onClose={() => setDeleteModalOpen(false)}
                    onSuccess={() => {
                        setDeleteModalOpen(false);
                        setDeleteSuccessModalOpen(true);
                        setOpenMatchId(null);
                        setDetailData(null);
                        fetchMatchups();
                    }}
                />
            )}

            {deleteSuccessModalOpen && (
                <SuccessModal
                    message="매치업이 삭제되었습니다"
                    onConfirm={() => setDeleteSuccessModalOpen(false)}
                />
            )}

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
