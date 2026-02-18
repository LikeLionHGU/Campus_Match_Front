import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationModal.css";

const TABS = [
  { key: "default", label: "알림", countKey: "defaultNoti" },
  { key: "send", label: "제안한 매치업", countKey: "sendNoti" },
  { key: "receive", label: "제안받은 매치업", countKey: "receiveNoti" },
  { key: "finish", label: "종료된 매치업", countKey: "finishNoti" },
];

const NotificationModal = ({ onClose, onNewChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("default");
  const [notifications, setNotifications] = useState([]);
  const [counts, setCounts] = useState({
    defaultNoti: 0,
    sendNoti: 0,
    receiveNoti: 0,
    finishNoti: 0,
  });

  const fetchTab = useCallback(async (tab) => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/notification/noti/${tab}`,
        {
          method: "GET",
          headers: {
            Authorization: token || "",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.detailResDtoList || []);
        setCounts({
          defaultNoti: data.defaultNoti || 0,
          sendNoti: data.sendNoti || 0,
          receiveNoti: data.receiveNoti || 0,
          finishNoti: data.finishNoti || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchTab(activeTab);
  }, [activeTab, fetchTab]);

  const handleDelete = async (notificationId) => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/notification/noti/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token || "",
          },
        },
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((n) => n.notificationId !== notificationId),
        );
        if (response.status !== 204) {
          try {
            const data = await response.json();
            if (onNewChange) onNewChange(data.isNew);
          } catch (e) {}
        }
        fetchTab(activeTab);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getClubDisplay = (item) => {
    if (item.awayClubName && item.awayClubUniversity) {
      return `${item.awayClubName}/${item.awayClubUniversity}`;
    }
    return item.awayClubName || "";
  };

  const renderNotification = (item) => {
    const club = getClubDisplay(item);

    switch (item.notiType) {
      case "remind":
        return (
          <div className="noti-item" key={item.notificationId}>
            <div className="noti-text">
              최근 {club}(과)와 매치업을 진행했습니다. 기억나시나요?
            </div>
            <button
              className="noti-close"
              onClick={() => handleDelete(item.notificationId)}
            >
              ×
            </button>
            <div className="noti-buttons">
              <button
                className="noti-action-btn"
                onClick={() => {
                  if (item.awayClubId) navigate(`/club/${item.awayClubId}`);
                }}
              >
                동아리 방문하기
              </button>
              <button
                className="noti-action-btn"
                onClick={() => navigate("/dashboard/gallery")}
              >
                갤러리 보러가기
              </button>
            </div>
          </div>
        );

      case "rematch":
        return (
          <div className="noti-item" key={item.notificationId}>
            <div className="noti-text">
              {club}가 최근 매치업에서 재매치 의사를 밝혔습니다. 나중에 다시
              매치업해보세요!
            </div>
            <button
              className="noti-close"
              onClick={() => handleDelete(item.notificationId)}
            >
              ×
            </button>
            <div className="noti-buttons">
              <button
                className="noti-action-btn"
                onClick={() => handleDelete(item.notificationId)}
              >
                확인
              </button>
            </div>
          </div>
        );

      case "schedule":
      case "matchCancle":
        return (
          <div className="noti-item" key={item.notificationId}>
            <div className="noti-text">
              {item.content || `${club} 관련 알림`}
            </div>
            <button
              className="noti-close"
              onClick={() => handleDelete(item.notificationId)}
            >
              ×
            </button>
          </div>
        );

      case "sendYes":
        return (
          <div className="noti-item" key={item.notificationId}>
            <div className="noti-text">{club}(이)가 매치업을 수락했습니다</div>
            <button
              className="noti-close"
              onClick={() => handleDelete(item.notificationId)}
            >
              ×
            </button>
            <div className="noti-buttons">
              <button
                className="noti-action-btn"
                onClick={() => navigate("/dashboard/scheduled")}
              >
                예정된 매치업으로 이동
              </button>
            </div>
          </div>
        );

      case "sendNo":
        return (
          <div className="noti-item" key={item.notificationId}>
            <div className="noti-text">
              {item.content || `${club}(이)가 매치업을 거절했습니다`}
            </div>
            <button
              className="noti-close"
              onClick={() => handleDelete(item.notificationId)}
            >
              ×
            </button>
          </div>
        );

      case "receive":
        return (
          <div className="noti-item" key={item.notificationId}>
            <div className="noti-text">{club}(이)가 매치업을 제안했습니다</div>
            <button
              className="noti-close"
              onClick={() => handleDelete(item.notificationId)}
            >
              ×
            </button>
            <div className="noti-buttons">
              <button
                className="noti-action-btn"
                onClick={() => navigate("/dashboard/scheduled")}
              >
                예정된 매치업으로 이동
              </button>
            </div>
          </div>
        );

      case "finish":
        return (
          <div className="noti-item" key={item.notificationId}>
            <div className="noti-text">
              오늘 {club}(와)과의 매치업은 어떠셨나요? 매치업을 마무리하러
              가시겠습니까?
            </div>
            <button
              className="noti-close"
              onClick={() => handleDelete(item.notificationId)}
            >
              ×
            </button>
            <div className="noti-buttons">
              <button
                className="noti-action-btn"
                onClick={() => navigate("/finishMatchup")}
              >
                종료된 매치업으로 이동
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="noti-item" key={item.notificationId}>
            <div className="noti-text">{item.content || "알림이 있습니다"}</div>
            <button
              className="noti-close"
              onClick={() => handleDelete(item.notificationId)}
            >
              ×
            </button>
          </div>
        );
    }
  };

  return (
    <>
      <div className="noti-backdrop" onClick={onClose} />
      <div className="noti-modal">
        <h2 className="noti-title">알림</h2>

        <div className="noti-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`noti-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {counts[tab.countKey] > 0 && (
                <span className="noti-badge">{counts[tab.countKey]}</span>
              )}
            </button>
          ))}
        </div>

        <div className="noti-list">
          {notifications.length > 0 ? (
            notifications.map((item) => renderNotification(item))
          ) : (
            <div className="noti-empty">알림이 없습니다</div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
