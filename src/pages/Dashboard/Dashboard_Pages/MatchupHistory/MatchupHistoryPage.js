import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../../components/SideBar/SideBar";
import MatchupHistoryModal from "./MatchupHistoryModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import "./MatchupHistoryPage.css";
import arrowIcon from "../../../../assets/arrow.svg";
import backIcon from "../../../../assets/arrow_left.svg";
import searchIcon from "../../../../assets/search.svg";

const MatchupHistoryPage = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      const clubId = localStorage.getItem("clubId");
      const token = localStorage.getItem("Authorization");
      if (!clubId) return;

      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/matchHistory/${clubId}`,
        {
          method: "GET",
          headers: {
            Authorization: token || "",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setHistoryList(data.List || data);
      }
    } catch (error) {
      console.error("Error fetching match history:", error);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getResultIcon = (result) => {
    switch (result) {
      case "승":
      case "승리":
        return <span className="result-text win">승</span>;
      case "패":
      case "패배":
        return <span className="result-text lose">패</span>;
      case "무":
      case "무승부":
        return <span className="result-text draw">무</span>;
      case "교류":
      case "단순 교류":
        return <span className="result-text exchange">교류</span>;
      default:
        return <span className="result-text">{result}</span>;
    }
  };

  const getFilteredItems = () => {
    let filtered = historyList;

    if (filter === "created") {
      filtered = filtered.filter((item) => item.matchPostId);
    } else if (filter === "added") {
      filtered = filtered.filter((item) => !item.matchPostId);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          (item.clubName &&
            item.clubName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.university &&
            item.university.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.location &&
            item.location.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleSuccess = () => {
    fetchHistory();
    setIsAddModalOpen(false);
    setEditData(null);
    setDeleteTarget(null);
  };

  return (
    <div className="history-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="history-content">
        <div className="history-header-container">
          <div className="history-header-top">
            <img
              src={backIcon}
              alt="Back"
              className="history-back-arrow"
              onClick={() => navigate("/dashboard")}
            />
            <div className="history-title">매치업 히스토리</div>
          </div>

          <div className="history-controls-row">
            <div className="history-left-controls">
              <div
                className="history-dropdown-container"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                onBlur={() => setTimeout(() => setIsFilterOpen(false), 200)}
                tabIndex={0}
              >
                <div
                  className={`history-dropdown-trigger ${isFilterOpen ? "active" : ""}`}
                >
                  <span>
                    {filter === "all"
                      ? "전체"
                      : filter === "created"
                        ? "생성된 매치업"
                        : "추가한 매치업"}
                  </span>
                  <img
                    src={arrowIcon}
                    alt="arrow"
                    className={`history-dropdown-arrow ${isFilterOpen ? "open" : ""}`}
                  />
                </div>
                {isFilterOpen && (
                  <div className="history-dropdown-options">
                    <div
                      className="history-dropdown-option"
                      onClick={() => {
                        setFilter("all");
                        setCurrentPage(1);
                      }}
                    >
                      전체
                    </div>
                    <div
                      className="history-dropdown-option"
                      onClick={() => {
                        setFilter("created");
                        setCurrentPage(1);
                      }}
                    >
                      생성된 매치업
                    </div>
                    <div
                      className="history-dropdown-option"
                      onClick={() => {
                        setFilter("added");
                        setCurrentPage(1);
                      }}
                    >
                      추가한 매치업
                    </div>
                  </div>
                )}
              </div>

              <div className="history-search-container">
                <input
                  type="text"
                  placeholder="검색"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <img
                  src={searchIcon}
                  alt="Search"
                  className="history-search-icon"
                />
              </div>
            </div>

            <button
              className="history-add-btn"
              onClick={() => setIsAddModalOpen(true)}
            >
              추가하기
            </button>
          </div>
        </div>

        <div className="history-list-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>
                  날짜
                  <img src={arrowIcon} alt="arrow" />
                </th>
                <th>동아리/대학</th>
                <th>장소</th>
                <th>결과</th>
                <th>수정 / 삭제</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.historyMatchId}>
                  <td>{item.matchDate}</td>
                  <td>
                    <div className="history-club-cell">
                      <img
                        src={item.logo || "/default-logo.png"}
                        alt="logo"
                        className="history-club-logo"
                      />
                      {item.clubName}/{item.university}
                    </div>
                  </td>
                  <td>{item.location}</td>
                  <td>{getResultIcon(item.result)}</td>
                  <td>
                    <div className="history-action-buttons">
                      <button
                        className="history-edit-btn"
                        onClick={() => setEditData(item)}
                      >
                        수정하기
                      </button>
                      <span className="history-separator">/</span>
                      <button
                        className="history-delete-btn"
                        onClick={() =>
                          setDeleteTarget({
                            ...item,
                            historyMatchId:
                              item.historyMatchId || item.matchHistoryId,
                          })
                        }
                      >
                        삭제하기
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="history-pagination">
            {(() => {
              return (
                <>
                  <button
                    className="page-control double"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    &lt;&lt;
                  </button>
                  <button
                    className="page-control"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        className={`page-number ${
                          currentPage === number ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </button>
                    ),
                  )}

                  <button
                    className="page-control"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages || 1),
                      )
                    }
                    disabled={currentPage === (totalPages || 1)}
                  >
                    &gt;
                  </button>
                  <button
                    className="page-control double"
                    onClick={() => setCurrentPage(totalPages || 1)}
                    disabled={currentPage === (totalPages || 1)}
                  >
                    &gt;&gt;
                  </button>
                </>
              );
            })()}
          </div>
        </div>

        {isAddModalOpen && (
          <MatchupHistoryModal
            mode="add"
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={handleSuccess}
          />
        )}

        {editData && (
          <MatchupHistoryModal
            mode="edit"
            historyData={editData}
            onClose={() => setEditData(null)}
            onSuccess={handleSuccess}
          />
        )}

        {deleteTarget && (
          <DeleteConfirmModal
            matchHistoryId={deleteTarget.historyMatchId}
            onClose={() => setDeleteTarget(null)}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default MatchupHistoryPage;
