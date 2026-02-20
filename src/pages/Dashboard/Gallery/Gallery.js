import EmptyImage from "../../../assets/empty.png";
import MainIcon from "../../../assets/Main_Icon_White.svg";
import "./Gallery.css";

const Gallery = ({ galleryList }) => {
  const galleryItem =
    galleryList && galleryList.length > 0 ? galleryList[0] : null;

  const calculateDaysAgo = (dateString) => {
    if (!dateString) return "";
    const today = new Date();
    const matchDate = new Date(dateString.split("T")[0]);
    today.setHours(0, 0, 0, 0);
    matchDate.setHours(0, 0, 0, 0);
    const diffTime = today - matchDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "오늘 교류";
    if (diffDays > 0) return `${diffDays}일전 교류`;
    return `${Math.abs(diffDays)}일후 교류`;
  };

  const imageUrl = galleryItem?.imageUrl || "";
  const hasImage = galleryItem && imageUrl !== "";

  return (
    <>
      <img
        className="gallery-img"
        src={hasImage ? imageUrl : EmptyImage}
        alt="gallery-img"
      />

      <div
        className={`gallery-img-overlay ${hasImage ? "has-image" : "empty-image"}`}
      >
        {hasImage ? (
          <>
            <img src={MainIcon} alt="MainIcon" />
            <span className="gallery-img-overlay-main">
              {calculateDaysAgo(galleryItem.matchDate)}
            </span>
            <span className="gallery-img-overlay-date">
              날짜: {galleryItem.matchDate}
            </span>
            <span className="gallery-img-overlay-name">
              이름: {galleryItem.title}
            </span>
          </>
        ) : (
          <>
            <img src={MainIcon} alt="MainIcon" />
            <span className="gallery-img-overlay-empty">
              아직 업로드된 이미지가 없습니다
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default Gallery;
