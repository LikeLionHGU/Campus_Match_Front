import { useState, useEffect,useCallback } from "react";
import BackArrow from "../../../../assets/arrow_left.svg";
import "./ClubCalenderDetailPage.css";
import Sidebar from "../../../../components/SideBar/SideBar";
import leftArrow from "../../../../assets/arrow_left.svg";
import rightArrow from "../../../../assets/arrow_right.svg";
import GreenCircle from "../../../../assets/green_circle.svg";
import BorderCircle from "../../../../assets/border_circle.svg";
import FilledCircle from "../../../../assets/filled_circle.svg";
import TodayRectangle from "../../../../assets/today_rectangle.svg";
import AddIcon from "../../../../assets/add_icon.svg";
import { useNavigate } from "react-router-dom";
import AddCalenderModal from "./AddCalenderModal/AddCalenderModal";
import EditCalenderModal from "./EditCalenderModal/EditCalenderModal";
// import MatchupCalenderModal from "./MatchupCalenderModal/MatchupCalenderModal";
import SuccessModal from "./SuccessModal/SuccessModal";
import EditIcon from "../../../../assets/edit_gray.svg"

const ClubCalenderDetailPage = () => {

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);

    const [modalType, setModalType] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);

    const [greenSchedules, setGreenSchedules] = useState([]);
    const [matchPosts, setMatchPosts] = useState([]);
    const [outlineSchedules, setOutlineSchedules]=useState([]);
    const [isMine, setIsMine] = useState(true);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0).getDate();
    const startDay = firstDay.getDay();

    const filledDates = matchPosts.map(post => post.matchDate);

    const outlineDates = outlineSchedules.map(post => post.matchDate);
    const parts = window.location.pathname.split("/").filter(Boolean);
    const dashIdx = parts.indexOf("dashboard");
    const next = parts[dashIdx + 1];

    const clubId = /^\d+$/.test(next) ? next : localStorage.getItem("clubId");

        
    

    const fetchSchedules = useCallback(async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_HOST_URL}/api/schedule/${clubId}`,
                {
                    headers: {
                        Authorization: localStorage.getItem("Authorization"),
                    },
                }
            );

            const data = await res.json();
            console.log(clubId);
            console.log(data);
            setIsMine(data.isMine);
            setMatchPosts([
                ...(data.ongoingResDtoList || []),
                ...(data.upcomingResDtoList || [])
            ]);
            setGreenSchedules(data.scheduleResDtoList || []);
            // setMatchPosts(data.matchPostResDtoList || []);
            setOutlineSchedules(data.matchResDtoList || []);

        } catch (e) {
            console.error(e);
        }
    }, [clubId]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);


    
    const navigate = useNavigate();

    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const dates = [];

    for (let i = startDay - 1; i >= 0; i--) {
        dates.push({
            date: prevMonthLastDate - i,
            isCurrentMonth: false,
        });
    }

    for (let i = 1; i <= lastDate; i++) {
        dates.push({
            date: i,
            isCurrentMonth: true,
        });
    }

    while (dates.length < 42) {
        dates.push({
            date: dates.length - (startDay + lastDate) + 1,
            isCurrentMonth: false,
        });
    }

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const makeDateKey = (y, m, d) => {
        const mm = String(m + 1).padStart(2, "0");
        const dd = String(d).padStart(2, "0");
        return `${y}-${mm}-${dd}`;
    };

    const handleCellClick = (dateKey) => {
        setSelectedDate(dateKey);
        setModalType("add");
    };

    const handleScheduleClick = (scheduleId, e) => {
        e.stopPropagation();
        setSelectedScheduleId(scheduleId);
        setModalType("edit");
    };
    const parseLocalDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
    };

    const currentMonthSchedules = greenSchedules
    .filter((schedule) => {
        const start = parseLocalDate(schedule.startDate);
        const end = parseLocalDate(schedule.endDate);

        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);

        return !(end < monthStart || start > monthEnd);
    })
    .sort((a, b) =>
        parseLocalDate(a.startDate) - parseLocalDate(b.startDate)
    );

    const currentMonthOutlineSchedules = outlineSchedules
    .filter((post) => {
        const date = new Date(post.matchDate);

        return (
            date.getFullYear() === year &&
            date.getMonth() === month
        );
    })
    .sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate));

    const currentMonthMatchSchedules = matchPosts
    .filter((post) => {
        const date = new Date(post.matchDate);

        return (
            date.getFullYear() === year &&
            date.getMonth() === month
        );
    })
    .sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate));

    const getDayOfWeek = (dateString) => {
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        const date = parseLocalDate(dateString);
        return days[date.getDay()];
    };

    const getDayNumber = (dateString) => {
        return parseLocalDate(dateString).getDate();
    };
    console.log("28일 일정:", greenSchedules.filter(s =>
    s.startDate.includes("-28") ||
    s.endDate.includes("-28")
));

    return (
        <>
            <div className="container">
                <div className="sidebar">
                    <Sidebar />
                </div>

                <div className="calender-detail-container">

                    <div className="calender-detail-header" onClick={() => navigate(-1)}>
                        <img src={BackArrow} alt="back-arrow" />
                        <span>스케줄</span>
                    </div>

                    <div className="calender-detail-main">

                        <div className="calender-detail-left">

                            <div className="calender-detail-left-header">
                                <img src={leftArrow} alt="prev" className="arrow" onClick={prevMonth}/>
                                <span>{year}년 {month + 1}월</span>
                                <img src={rightArrow} alt="next" className="arrow" onClick={nextMonth}/>
                            </div>

                            <div className="calender-detail-left-week">
                                {["일","월","화","수","목","금","토"].map((day) => (
                                    <div key={day}>{day}</div>
                                ))}
                            </div>

                            <div className="calender-detail-left-grid">
                                {dates.map((item, idx) => {

                                    // const cellDate = new Date(year, month, item.date);
                                    const dateKey = makeDateKey(year, month, item.date);


                                    const isToday =
                                        item.isCurrentMonth &&
                                        item.date === today.getDate() &&
                                        month === today.getMonth() &&
                                        year === today.getFullYear();

                                    const filled =
                                        item.isCurrentMonth &&
                                        filledDates.includes(dateKey);

                                    const outline =
                                        item.isCurrentMonth &&
                                        outlineDates.includes(dateKey);

                                    const daySchedules = greenSchedules.filter((schedule) => {
                                        if (!item.isCurrentMonth) return false;

                                        const start = new Date(schedule.startDate);
                                        const end = new Date(schedule.endDate);
                                        end.setHours(23, 59, 59, 999);
                                        const current = new Date(dateKey);

                                        return current >= start && current <= end;
                                    });
                                    return (
                                        <div
                                            key={idx}
                                            className={`
                                                calender-detail-left-cell
                                                ${isToday ? 'today' : ""}
                                                ${!item.isCurrentMonth ? "other-month" : ""}
                                            `}
                                            onClick={(e) => {

                                                if (!isMine) return;

                                                const scheduleElement = e.target.closest(".schedule-item");

                                                if (scheduleElement && e.currentTarget.contains(scheduleElement)) {
                                                    return;
                                                }

                                                if (item.isCurrentMonth) {
                                                    handleCellClick(dateKey);
                                                }

                                            }}
                                            style={{
                                                cursor: isMine ? "pointer" : "default"
                                            }}
                                        >

                                            <div
                                                className={`
                                                    calender-detail-left-date
                                                    ${filled ? "filled" : ""}
                                                    ${outline ? "outline" : ""}
                                                `}
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    if (filled) {
                                                        console.log("filled click", dateKey);

                                                        // 나중에 모달
                                                        // setModalType("filled");
                                                    }

                                                    if (outline) {
                                                        console.log("outline click", dateKey);

                                                        // setModalType("outline");
                                                    }

                                                }}
                                                style={{
                                                    cursor:
                                                        filled || outline
                                                            ? "pointer"
                                                            : isMine
                                                            ? "pointer"
                                                            : "default"
                                                }}
                                            >
                                                {item.date}
                                            </div>

                                            <div className="calender-detail-left-schedules">
                                                {daySchedules.slice(0,4).map((schedule) => (
                                                    <div
                                                        key={schedule.scheduleId}
                                                        className="schedule-item green"
                                                        style={{
                                                            cursor: isMine ? "pointer" : "default",
                                                            opacity: isMine ? 1 : 0.6
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            if (!isMine) return;

                                                            handleScheduleClick(schedule.scheduleId, e);
                                                        }}
                                                    >
                                                        <img
                                                            src={GreenCircle}
                                                            alt="green_circle"
                                                            className="schedule-item-icon"
                                                        />
                                                        <span>{schedule.title}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {isMine && (
                                                <div className="calender-detail-left-add-wrapper">

                                                    <img
                                                        src={AddIcon}
                                                        alt="add_icon"
                                                        className="calender-detail-left-add add-icon"
                                                    />

                                                    <img
                                                        src={EditIcon}
                                                        alt="edit_icon"
                                                        className="calender-detail-left-add edit-icon"
                                                    />

                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="calender-detail-right">
                            <div className="calender-detail-right-top">
                                <div>
                                    <img src={GreenCircle} alt="green_circle" />
                                    <span>동아리 일정</span>
                                </div>
                                <div>
                                    <img src={BorderCircle} alt="border_circle" />
                                    <span>매치업 가능</span>
                                </div>
                                <div>
                                    <img src={FilledCircle} alt="filled_circle" />
                                    <span>매치업</span>
                                </div>
                                <div>
                                    <img src={TodayRectangle} alt="today_rectangle" />
                                    <span>오늘</span>
                                </div>
                            </div>

                            <div className="calender-detail-right-bottom">
                                <div className="calender-detail-right-bottom-first">
                                    <div className="calender-detail-right-bottom-first-title">
                                        <span >동아리 일정</span>
                                    </div>
                                    
                                    <div className="calender-detail-right-bottom-first-item">
                                        {currentMonthSchedules.map((schedule) => (
                                            <div
                                                key={schedule.scheduleId}
                                                className="right-schedule-item"
                                            >
                                                <span>
                                                    {month+1}/{getDayNumber(schedule.startDate)}
                                                </span>

                                                <span>
                                                    &nbsp;&#40;{getDayOfWeek(schedule.startDate)}&#41; -&nbsp;
                                                </span>

                                                <span>
                                                    {schedule.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="calender-detail-right-bottom-second">
                                    <div className="calender-detail-right-bottom-second-title">
                                        <span >매치업 가능</span>
                                    </div>
                                    <div className="calender-detail-right-bottom-first-item">
                                        {currentMonthOutlineSchedules.map((post) => (
                                            <div
                                                key={post.matchPostId}
                                                className="right-schedule-item"
                                            >
                                                <span>
                                                    {month + 1}/{getDayNumber(post.matchDate)}
                                                </span>

                                                <span>
                                                    &nbsp;&#40;{getDayOfWeek(post.matchDate)}&#41;
                                                </span>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="calender-detail-right-bottom-third">
                                    <div className="calender-detail-right-bottom-third-title">
                                        <span >매치업</span>
                                    </div>
                                    <div className="calender-detail-right-bottom-first-item">
                                        {currentMonthMatchSchedules.map((post) => (
                                            <div
                                                key={post.matchPostId}
                                                className="right-schedule-item"
                                            >
                                                <span>
                                                    {month + 1}/{getDayNumber(post.matchDate)}
                                                </span>

                                                <span>
                                                    &nbsp; &#40;{getDayOfWeek(post.matchDate)}&#41; -&nbsp;
                                                </span>

                                                <span>
                                                    {post.clubName}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {modalType === "add" && (
                <AddCalenderModal
                    date={selectedDate}
                    onClose={() => setModalType(null)}
                    onSuccess={() => {
                        setModalType("success-add");
                        fetchSchedules(); 
                    }}
                />
            )}

            {modalType === "edit" && (
                <EditCalenderModal
                    scheduleId={selectedScheduleId}
                    onClose={() => {setModalType(null)}}
                    onSuccess={() => {
                        setModalType("success-edit");
                        fetchSchedules();   
                    }}
                    onDelete={() => {
                        setModalType("success-delete");
                        fetchSchedules();   
                    }}

                />
            )}

            {modalType === "success-add" && (
                <SuccessModal
                    message="저장되었습니다"
                    onConfirm={() => setModalType(null)}
                />
            )}

            {modalType === "success-edit" && (
                <SuccessModal
                    message="수정되었습니다"
                    onConfirm={() => setModalType(null)}
                />
            )}

            {modalType === "success-delete" && (
                <SuccessModal
                    message="삭제되었습니다"
                    onConfirm={() => setModalType(null)}
                />
            )}
        </>
    );
};

export default ClubCalenderDetailPage;
