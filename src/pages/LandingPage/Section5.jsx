import "./Section5.css";
import Background from "../../assets/background_section5.png";
import { useNavigate } from "react-router-dom";

const Section5 = () => {
    const navigate = useNavigate();
    const handleScrollTop = () => {
        const wrapper = document.querySelector('.landing-wrapper');
        if (wrapper) {
            wrapper.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const handleGoToTop = () => {
        window.scrollTo({
            top: 0,
        });
    };
    return (

        <>  
            <div className="section5-image-wrapper">
                <img className="section5-background" src={Background} alt="background" />
                <div className="section5-overlay"></div>
            </div>
            
            <div className="section5">
                <div className="section5-top">
                    이미 100개 이상의 동아리가 기록을 시작했습니다.
                </div>
                <div
                    className="section5-middle"
                    onClick={()=>{
                        navigate("/register");
                        handleGoToTop();
                    }}
                >
                    <button>동아리 페이지 만들기</button>
                </div>
                <div className="section5-bottom" onClick={handleScrollTop}>
                    Top of page
                </div>
            </div>
        </>

    );

};

export default Section5;
