import React, { useState, useEffect, useCallback } from "react";
import "./Header.css";
import logo from "../../assets/긴로고-SB 1.png";
import accountIcon from "../../assets/account.svg";
import notificationIcon from "../../assets/notification.svg";
import NotificationModal from "../Notification/NotificationModal";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const isLogin = !!localStorage.getItem("Authorization");
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  const checkNewNotifications = useCallback(async () => {
    if (!isLogin) return;

    try {
      const token = localStorage.getItem("Authorization");
      const urls = ["default", "send", "receive", "finish"];

      const fetchPromises = urls.map((tab) =>
        fetch(
          `${process.env.REACT_APP_HOST_URL}/api/notification/noti/${tab}`,
          {
            method: "GET",
            headers: { Authorization: token || "" },
          },
        )
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null),
      );

      const results = await Promise.all(fetchPromises);
      let hasAnyItemsOrCounts = false;

      for (const data of results) {
        if (!data) continue;

        // Check if the backend correctly returned counts
        if (
          (data.defaultNoti || 0) > 0 ||
          (data.sendNoti || 0) > 0 ||
          (data.receiveNoti || 0) > 0 ||
          (data.finishNoti || 0) > 0
        ) {
          hasAnyItemsOrCounts = true;
          break;
        }

        // Fallback: Check if the actual raw array has contents
        if (data.detailResDtoList && data.detailResDtoList.length > 0) {
          hasAnyItemsOrCounts = true;
          break;
        }
      }

      setHasNew(hasAnyItemsOrCounts);
    } catch (error) {
      console.error("Error boldly checking notifications:", error);
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
              <div
                className="logo-clickable"
                onClick={() => {
                  if (isLogin) {
                    navigate("/dashboard");
                  } else {
                    navigate("/");
                  }
                }}
              >
                <img src={logo} alt="logo" />
              </div>
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
          onNotificationsChange={checkNewNotifications}
        />
      )}
    </>
  );
};

export default Header;
