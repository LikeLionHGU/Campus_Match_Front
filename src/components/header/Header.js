import React, { useState, useEffect, useCallback } from "react";
import "./Header.css";
import logo from "../../assets/긴로고-SB 1.png";
import accountIcon from "../../assets/account.svg";
import notificationIcon from "../../assets/notification.svg";
import NotificationModal from "../Notification/NotificationModal";

const Header = () => {
  const isLogin = !!localStorage.getItem("Authorization");
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  const checkNewNotifications = useCallback(async () => {
    if (!isLogin) return;
    try {
      const token = localStorage.getItem("Authorization");
      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/notification/noti`,
        {
          method: "GET",
          headers: {
            Authorization: token || "",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setHasNew(data.isNew);
      }
    } catch (error) {
      console.error("Error checking notifications:", error);
    }
  }, [isLogin]);

  useEffect(() => {
    checkNewNotifications();
  }, [checkNewNotifications]);

  const handleBellClick = () => {
    setIsNotiOpen((prev) => !prev);
  };

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
                <button
                  className="bell"
                  aria-label="알림"
                  onClick={handleBellClick}
                >
                  <img src={notificationIcon} alt="알림" />
                  {hasNew && <span className="bell-dot" />}
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

      {isNotiOpen && (
        <NotificationModal
          onClose={() => setIsNotiOpen(false)}
          onNewChange={(isNew) => setHasNew(isNew)}
        />
      )}
    </>
  );
};

export default Header;
