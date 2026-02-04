import "./Header.css";
import logo from "../../assets/긴로고-SB 1.png"

const Header = () => {
    const isLogin = false;
    return (
        <>
            <header className="header">
                <div className="inner">
                    <div className="left">
                        <div className="logo">
                            <img src={logo} alt="logo"/>

                        </div>
                        {/* <nav className="nav">
                            <a href="/">매치업</a>
                            <a href="/search">동아리검색</a>
                             <a href="/add">동아리추가</a>
                        </nav> */}
                    </div>
                    
                    <nav className="user">
                        {isLogin ? (
                            <>
                            <a href="/mypage">마이페이지</a>
                            <a href="/logout">로그아웃</a>
                            <button className="bell " aria-label="알림">
                                알림
                                {/* <img src="/icons/bell.svg" alt="알림" /> */}
                            </button>
                            </>
                        ):(
                            <>
                            <a href="/login">로그인</a>
                            <a href="/register">회원가입</a>
                            </>
                        )
                        } 
                    </nav>

                </div>
            </header>
        </>
    )
}

export default Header;