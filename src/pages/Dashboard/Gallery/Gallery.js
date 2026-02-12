import MainImage from "../../../assets/example.png";
import EmptyImage from "../../../assets/empty.png";
import MainIcon from "../../../assets/Main_Icon_White.svg"
import "./Gallery.css";

const Gallery = () => {

  
  const imageUrl = MainImage;   

  const hasImage = imageUrl && imageUrl !== "";

  return (
    
    <>
      <img
        className="gallery-img"
        src={hasImage ? imageUrl : EmptyImage}
        alt="gallery-img"
      />

      <div className={`gallery-img-overlay ${hasImage ? "has-image" : "empty-image"}`}>
        {hasImage ? (
          <>
            <img src={MainIcon} alt="MainIcon" />
            <span className="gallery-img-overlay-main">15일전 교류</span>
            <span className="gallery-img-overlay-date">날짜:</span>
            <span className="gallery-img-overlay-name">이름:</span>
          </>
        ) : (
          <>
            <img src={MainIcon} alt="MainIcon" />
            <span className="gallery-img-overlay-empty">아직 업로드된 이미지가 없습니다</span>
          </>
        )}
      </div>

    </>
  );
};

export default Gallery;
