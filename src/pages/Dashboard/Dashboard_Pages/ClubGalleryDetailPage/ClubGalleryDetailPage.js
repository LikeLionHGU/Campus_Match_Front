import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../../components/SideBar/SideBar";
import GalleryUploadModal from "./GalleryUploadModal";
import MainLogo from "../../../../assets/mainLogo.png";
import "./ClubGalleryDetailPage.css";
import searchIcon from "../../../../assets/search.svg";

const ClubGalleryDetailPage = () => {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchGallery = useCallback(async () => {
    try {
      const clubId = localStorage.getItem("clubId");
      const token = localStorage.getItem("Authorization");

      if (!clubId) return;

      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/gallery/${clubId}`,
        {
          method: "GET",
          headers: {
            Authorization: token || "",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data);
      } else if (response.status === 403) {
        console.error("403 Forbidden: Check token or clubId");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="gallery-detail-container">
        <div className="gallery-header">
          <div className="header-top" onClick={() => navigate("/dashboard")}>
            <span className="back-arrow">&lt;</span>
            <h2>갤러리</h2>
          </div>

          <div className="header-controls">
            <div className="filter-search-group">
              <select
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">전체</option>
              </select>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">
                  <img src={searchIcon} alt="Search" />
                </span>
              </div>
            </div>

            <button className="add-btn" onClick={() => setIsUploadOpen(true)}>
              추가하기
            </button>
          </div>
        </div>

        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div key={item.galleryId} className="gallery-card">
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

        {isUploadOpen && (
          <GalleryUploadModal
            onClose={() => setIsUploadOpen(false)}
            onSuccess={() => {
              setIsUploadOpen(false);
              fetchGallery();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ClubGalleryDetailPage;
