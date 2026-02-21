import "./Section4.css";
import Circle1 from "../../assets/circle1_section4.svg";
import Circle2 from "../../assets/circle2_section4.svg";
import Circle3 from "../../assets/circle3_section4.svg";
import Img1 from "../../assets/img1_section4.png";
import Img2 from "../../assets/img2_section4.png";
import Img3 from "../../assets/img3_section4.png";
const Section4 = () => {

  return (

    <>
      <div className="section4">
        <div className="section4-header">
          <span>동아리 운영이 쉬워지는 3가지 이유</span>
        </div>
        <div className="section4-main">
          <div className="section4-main-left">
            <div className="section4-main-top">
              <img src={Circle1} alt="circle1" />
              <div className="section4-title">
                매치업관리
              </div>
              <div className="section4-sub">
                경기의, 모든 과정을 하나의<br></br>
                '매치업 카드'로 공식 관리하세요
              </div>
            </div>
            <img src={Img1} alt="img1" />
          </div>

          <div className="section4-main-middle">
            <div className="section4-main-top">
              <img src={Circle2} alt="circle2" />
              <div className="section4-title">
                일정 관리
              </div>
              <div className="section4-sub">
                경기 일정을 한눈에 파악하고 <br></br>
                팀원들에게 공유하세요 
              </div>
            </div>
            <img src={Img2} alt="img2" />
          </div>

          <div className="section4-main-right">
            <div className="section4-main-top">
              <img src={Circle3} alt="circle3" />
              <div className="section4-title">
                동아리 배지
              </div>
              <div className="section4-sub">
                활동할수록 모이는 배지로 <br></br>
                동아리 개설을 뽐내세요
              </div>
            </div>
            <img src={Img3} alt="img3" />
          </div>
        </div>

      </div>
    </>

  );

};

export default Section4;
