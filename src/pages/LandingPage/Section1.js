import Notebook from "../../assets/notebook_section1.svg";
import Background from "../../assets/background_section1.svg";
import "./Section1.css";
const Section1 = () => {

  return (
    <>  
        <div className="section1">
            <div className="section1-top">
                <span className="section1-top-main">
                흩어지는 땀방울, 기록되는 역사
                </span>
                <span className="section1-top-sub">
                대학 스포츠 동아리를 연결해 지속적인 교류를 이어주는 서비스
                </span>
                <button className="section1-top-button">동아리 페이지 만들기</button>
            </div>
            <div className="section1-bottom">
                <img className="section1-bottom-notebook" src={Notebook} alt="notebook" />
                <img className="section1-bottom-background" src={Background} alt="background" />
            </div>
        </div>
        
    </>
    

  );

};

export default Section1;
