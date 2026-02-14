import "./Header.css";
import logo from "../../assets/긴로고-SB 1.png";
import accountIcon from "../../assets/account.svg";
import notificationIcon from "../../assets/notification.svg";

const Header = () => {
  const isLogin = !!localStorage.getItem("Authorization");
  return (
    <>
      <header className="header">
        <div className="inner">
          <div className="left">
            <div className="logo">
              <a href="/dashboard">
                <img src={logo} alt="logo" />
              </a>
            </div>
          </div>

          <nav className="user">
            {isLogin ? (
              <>
                <button className="account" aria-label="설정">
                  <a href="/mypage">
                    <img src={accountIcon} alt="설정" />
                  </a>
                </button>
                <button className="bell" aria-label="알림">
                  <img src={notificationIcon} alt="알림" />
                </button>
              </>
            ) : (
              <>
                <a href="/login">로그인</a>
                <a href="/register">회원가입</a>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
