import "./Section2.css";
import RightImg from "../../assets/right_section2.png";
import Background from "../../assets/background_section1.svg";
const Section2 = () => {

  return (

    <>
      <img className="section2-back" src={Background} alt="background" />
      <div className="section2">
        <div className="section2-left">
          
          <div className="section2-left-main">
            <span>매너도 실력입니다</span>
            <br></br>
            <span className="section2-left-main-color">온도로 </span>
            <span>증명해보세요</span>
          </div>
          <div>
            <span className="section2-left-sub">
            상호 평가로 만들어진 '매치 온도'통해 검증된 팀하고만 경기하세요
            </span>
          </div>
          
        </div>
        <div>
          <img className="section2-right-img" src={RightImg} alt="right" />
        </div>
      </div>
    </>

  );

};

export default Section2;
