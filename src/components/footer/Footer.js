import "./Footer.css";
import logo from "../../assets/긴로고-SB 1.png"


const Footer = () => {
    return (
        <>
            <footer>
                <div className="footer-main">
                    <div className="footer-right">
                        <img src={logo} alt="logo"/>
                        <p className="footer-intro">대학 스포츠 동아리를 연결해 지속적인 교류를 이어주는 서비스</p>
                        <p className="phone">전화 | 010-2684-8939</p>
                        <p className="email">메일 | jwy0412@handong.ac.kr</p>
                        <p className="address">주소 | 경상북도 포항시 북구 흥해읍 한동로 558, 한동대학교</p>
                    </div>
                    <div className="footer-left">
                        <p className="teamname">© 2026 Campus Match Team. All rights reserved.</p>
                    </div>

                </div>
            </footer>
        </>
    )
}

export default Footer;