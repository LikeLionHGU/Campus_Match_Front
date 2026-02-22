import Sidebar from "../../components/SideBar/SideBar";
import "./ClubSearchBoardPage.css";
import { useState, useEffect, useCallback } from "react";
import ArrowLeft from "../../assets/arrow_left.svg";
import ArrowLeftDouble from "../../assets/arrow_left_double.svg";
import ArrowRight from "../../assets/arrow_right.svg";
import ArrowRightDouble from "../../assets/arrow_right_double.svg";
import ClubSearchModal from "./ClubSearchModal/ClubSearchModal";
import SearchIcon from "../../assets/search.svg";
import ArrowDownGray from "../../assets/arrow_down_gray.svg";
import ResetIcon from "../../assets/reset.svg";
import CloseIcon from "../../assets/close.svg";
import DefaultClubIcon from "../../assets/Main_Icon_Gray.svg";
import { useNavigate } from "react-router-dom";
import SearchGrayIcon from "../../assets/search_gray.svg";

const ClubSearchBoardPage = () => {
  const [matchups, setMatchups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateOrder] = useState("asc");
  const navigate = useNavigate();
  // const [detailModalOpen, setDetailModalOpen] = useState(false);

  // const [selectedMatchId, setSelectedMatchId] = useState(null);

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [keyword, setKeyword] = useState("");

  const [filters, setFilters] = useState({
    regions: [],
    sports: [],
  });
  const [isFocused, setIsFocused] = useState(false);

  const displayFilters = [
    ...filters.regions.map((r) => ({
      type: "region",
      label: r,
      value: r,
    })),
    ...filters.sports.map((s) => ({
      type: "sport",
      label: s,
      value: s,
    })),
  ];

  const sortedMatchups = [...matchups].sort((a, b) => {
    const dateA = new Date(a.matchDate);
    const dateB = new Date(b.matchDate);

    return dateOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const pageSize = 10;

  const fetchMatchups = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (keyword.trim() !== "") {
        params.append("keyword", keyword);
      }

      if (filters.regions.length > 0) {
        params.append("regions", filters.regions.join(","));
      }

      if (filters.sports.length > 0) {
        params.append("sports", filters.sports.join(","));
      }

      const res = await fetch(`${process.env.REACT_APP_HOST_URL}/api/club`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("Authorization"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sportCategoryList: filters.sports,
          regionList: filters.regions,
          keyword: keyword,
        }),
      });

      if (!res.ok) throw new Error();
      console.log(filters);
      const data = await res.json();

      setMatchups(Array.isArray(data) ? data : data.List || []);
      setCurrentPage(1);
    } catch (e) {
      console.error("matchup load fail", e);
    }
  }, [keyword, filters]);

  useEffect(() => {
    fetchMatchups();
  }, [fetchMatchups]);

  const totalPages = Math.max(1, Math.ceil(matchups.length / pageSize));

  const pagedMatchups = sortedMatchups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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

        <div className="clubsearch-board-container">
          <div className="clubsearch-board-header">
            <div className="clubsearch-board-header-search">
              <div className="clubsearch-board-header-search-input">
                <input
                  type="text"
                  placeholder="검색"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <img
                  src={isFocused ? SearchIcon : SearchGrayIcon}
                  alt="search"
                />
              </div>

              <div className="clubsearch-board-search-condition">
                <div
                  className="clubsearch-board-search-condition-left"
                  onClick={() => setSearchModalOpen(true)}
                >
                  검색조건
                  <img src={ArrowDownGray} alt="arrow_down" />
                </div>

                <div className="clubsearch-board-search-condition-middle">
                  {displayFilters.map((item, idx) => (
                    <div className="clubsearch-board-filter-chip" key={idx}>
                      <span className="filter-chip-text">{item.label}</span>

                      <div
                        className="filter-chip-remove"
                        onClick={(e) => {
                          e.stopPropagation();

                          if (item.type === "region") {
                            setFilters((prev) => ({
                              ...prev,
                              regions: prev.regions.filter(
                                (r) => r !== item.value,
                              ),
                            }));
                          }

                          if (item.type === "sport") {
                            setFilters((prev) => ({
                              ...prev,
                              sports: prev.sports.filter(
                                (s) => s !== item.value,
                              ),
                            }));
                          }

                          if (item.type === "date") {
                            setFilters((prev) => ({
                              ...prev,
                              startDate: null,
                              endDate: null,
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
                  className="clubsearch-board-search-condition-right"
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
          </div>

          <div className="clubsearch-board-main">
            <div className="clubsearch-board-content">
              <div className="clubsearch-board-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>지역</th>
                      <th>대학교</th>
                      <th>동아리</th>
                      <th>종목</th>
                      <th>매치온도</th>
                      <th>방문하기</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pagedMatchups.map((item, idx) => (
                      <tr key={item.clubId ? `${item.clubId}-${idx}` : idx}>
                        <td>{item.region}</td>
                        <td>{item.university}</td>
                        <td>
                          <div className="club-board-clubName">
                            <img
                              className="club-small-icon"
                              src={item.imageUrl || DefaultClubIcon}
                              alt="club-icon"
                            />
                            <span>{item.clubName}</span>
                          </div>
                        </td>
                        <td>{item.sportCategory}</td>
                        <td>{item.mannerScore}°C</td>

                        <td>
                          <div>
                            <button
                              onClick={() => {
                                navigate(
                                  `/club-board/dashboard/${item.clubId}`,
                                );
                              }}
                            >
                              방문하기
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="clubsearch-board-pagination">
                <div className="pagination-move">
                  <img
                    className="clubsearch-board-pagination-double"
                    src={ArrowLeftDouble}
                    alt="<<"
                    onClick={goFirstBlock}
                  />
                  <img
                    className="clubsearch-board-pagination-mono"
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
                    className="clubsearch-board-pagination-mono"
                    src={ArrowRight}
                    alt=">"
                    onClick={goNext}
                  />
                  <img
                    className="clubsearch-board-pagination-double"
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
        <ClubSearchModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setSearchModalOpen(false)}
        />
      )}
    </>
  );
};

export default ClubSearchBoardPage;
