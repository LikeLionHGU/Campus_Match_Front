import "./Section3.css";
import LeftImage from "../../assets/left_section3.png";
import Background from "../../assets/background_section1.svg";
const Section3 = () => {

  return (

    <>
      <img className="section3-back" src={Background} alt="background" />
      <div className="section3">
          <div className="section3-left">
            <img src={LeftImage} alt="left" />
          </div>
          <div className="section3-right">
            <div className="section3-right-main">
              <span>승패 </span>
              <span className="section3-right-main-color">기록이 </span>
              <span>곧</span>
              <br></br>
              <span>우리 팀의 포트폴리오</span>
            </div>
            <div className="section3-right-sub">
              <span>
                경기 결과를 입력하는 순간, 전적 
                <br></br>데이터가 자동으로 자산처럼 쌓입니다
                
              </span>
            </div>
            
          </div>
      </div>
    </>

  );

};

export default Section3;
