import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../../components/SideBar/SideBar";
import GalleryUploadModal from "./GalleryUploadModal";
import GalleryDetailModal from "./GalleryDetailModal";
import MainLogo from "../../../../assets/mainLogo.png";
import "./ClubGalleryDetailPage.css";
import searchIcon from "../../../../assets/search.svg";
import arrowIcon from "../../../../assets/arrow.svg";
import backIcon from "../../../../assets/arrow_left.svg";

const ClubGalleryDetailPage = () => {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchGallery = useCallback(async (currentFilter) => {
    try {
      const clubId = localStorage.getItem("clubId");
      const token = localStorage.getItem("Authorization");

      if (!clubId) return;

      let url = `${process.env.REACT_APP_HOST_URL}/api/gallery/${clubId}`;

      if (currentFilter === "our") {
        url = `${process.env.REACT_APP_HOST_URL}/api/gallery/myClub/${clubId}`;
      } else if (currentFilter === "matchup") {
        url = `${process.env.REACT_APP_HOST_URL}/api/gallery/match/${clubId}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        setGalleryItems(Array.isArray(data) ? data : data.List || []);
      } else if (response.status === 403) {
        console.error("403 Forbidden: Check token or clubId");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchGallery(filter);
  }, [fetchGallery, filter]);

  const handleCardClick = async (item) => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/gallery/detail/${item.galleryId}`,
        {
          method: "GET",
          headers: {
            Authorization: token || "",
          },
        },
      );

      if (response.ok) {
        const detail = await response.json();
        setSelectedItem({ ...item, ...detail });
      } else {
        setSelectedItem(item);
      }
    } catch (error) {
      console.error("Error fetching gallery detail:", error);
      setSelectedItem(item);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="gallery-detail-container">
        <div className="gallery-header-container">
          <div className="header-top">
            <img
              src={backIcon}
              alt="Back"
              className="back-arrow"
              onClick={() => navigate("/dashboard")}
            />
            <div className="gallery-title">갤러리</div>
          </div>

          <div className="gallery-controls-row">
            <div className="left-controls">
              <div
                className="custom-dropdown-container"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                onBlur={() => setTimeout(() => setIsFilterOpen(false), 200)}
                tabIndex={0}
              >
                <div
                  className={`dropdown-trigger ${isFilterOpen ? "active" : ""}`}
                >
                  <span>
                    {filter === "all"
                      ? "전체"
                      : filter === "our"
                        ? "우리들 갤러리"
                        : "매치업 갤러리"}
                  </span>
                  <img
                    src={arrowIcon}
                    alt="arrow"
                    className={`dropdown-arrow ${isFilterOpen ? "open" : ""}`}
                  />
                </div>
                {isFilterOpen && (
                  <div className="dropdown-options">
                    <div
                      className="dropdown-option"
                      onClick={() => {
                        setFilter("all");
                        setCurrentPage(1);
                      }}
                    >
                      전체
                    </div>
                    <div
                      className="dropdown-option"
                      onClick={() => {
                        setFilter("our");
                        setCurrentPage(1);
                      }}
                    >
                      우리들 갤러리
                    </div>
                    <div
                      className="dropdown-option"
                      onClick={() => {
                        setFilter("matchup");
                        setCurrentPage(1);
                      }}
                    >
                      매치업 갤러리
                    </div>
                  </div>
                )}
              </div>

              <div className="search-container">
                <input
                  type="text"
                  placeholder="검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img src={searchIcon} alt="Search" className="search-icon" />
              </div>
            </div>

            <button className="add-btn" onClick={() => setIsUploadOpen(true)}>
              추가하기
            </button>
          </div>
        </div>

        {(() => {
          let filteredItems = galleryItems;

          if (searchTerm) {
            filteredItems = filteredItems.filter((item) =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase()),
            );
          }

          const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
          const indexOfLastItem = currentPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          const currentItems = filteredItems.slice(
            indexOfFirstItem,
            indexOfLastItem,
          );

          return (
            <>
              <div className="gallery-grid">
                {currentItems.map((item) => (
                  <div
                    key={item.galleryId}
                    className="gallery-card"
                    onClick={() => handleCardClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="image-wrapper">
                      {item.isOfficial && (
                        <img
                          src={MainLogo}
                          alt="Official"
                          className="official-logo-badge"
                        />
                      )}
                      <img src={item.imageUrl} alt={item.title} />
                    </div>
                    <div className="info">
                      <span className="date">날짜: {item.matchDate}</span>
                      <span className="title">이름: {item.title}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="gallery-pagination">
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
                <button
                  className="page-control double"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  &gt;&gt;
                </button>
              </div>
            </>
          );
        })()}

        {isUploadOpen && (
          <GalleryUploadModal
            onClose={() => setIsUploadOpen(false)}
            onSuccess={() => {
              setIsUploadOpen(false);
              fetchGallery();
            }}
          />
        )}

        {selectedItem && (
          <GalleryDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onUpdate={() => {
              setSelectedItem(null);
              fetchGallery();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ClubGalleryDetailPage;
