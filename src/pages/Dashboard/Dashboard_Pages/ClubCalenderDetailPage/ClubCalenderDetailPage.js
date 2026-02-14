import { useState } from "react";
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

import AddCalenderModal from "./AddCalenderModal/AddCalenderModal";
import EditCalenderModal from "./EditCalenderModal/EditCalenderModal";
import MatchupCalenderModal from "./MatchupCalenderModal/MatchupCalenderModal";
import SuccessModal from "./SuccessModal/SuccessModal";

const ClubCalenderDetailPage = () => {

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);

    const [modalType, setModalType] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0).getDate();
    const startDay = firstDay.getDay();

    const filledDates = [
        "2026-02-08",
        "2026-02-19",
        "2026-02-20"
    ];

    const outlineDates = [
        "2026-02-09",
        "2026-02-11"
    ];

    const greenDates = [
        "2026-02-21",
        "2026-02-28"
    ];

    const prevMonthLastDate =
        new Date(year, month, 0).getDate();

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

    /* ✅ 날짜 클릭 시 모달 분기 */
    const handleCellClick = (dateKey) => {

        setSelectedDate(dateKey);

        // 매치업 일정
        if (outlineDates.includes(dateKey)) {
            setModalType("matchup");
            return;
        }

        // 일반 일정
        if (greenDates.includes(dateKey)) {
            setModalType("edit");
            return;
        }

        // 일정 없음
        setModalType("add");
    };

    return(
        <>
            <div className="container">
                <div className="sidebar">
                    <Sidebar/>
                </div>

                <div className="calender-detail-container">

                    <div className="calender-detail-header">
                        <img src={BackArrow} alt="back-arrow" />
                        <span>스케줄</span>
                    </div>

                    <div className="calender-detail-main">

                        {/* LEFT */}
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

                                    const dateKey = makeDateKey(year, month, item.date);

                                    const isToday =
                                        item.isCurrentMonth &&
                                        item.date === today.getDate() &&
                                        month === today.getMonth() &&
                                        year === today.getFullYear();

                                    const green =
                                        item.isCurrentMonth &&
                                        greenDates.includes(dateKey);

                                    const filled =
                                        item.isCurrentMonth &&
                                        filledDates.includes(dateKey);

                                    const outline =
                                        item.isCurrentMonth &&
                                        outlineDates.includes(dateKey);

                                    return (
                                        <div
                                            key={idx}
                                            className={`
                                                calender-detail-left-cell
                                                ${isToday ? 'today' : ""}
                                                ${!item.isCurrentMonth ? "other-month" : ""}
                                            `}
                                            onClick={() =>
                                                item.isCurrentMonth &&
                                                handleCellClick(dateKey)
                                            }
                                        >
                                            <div
                                                className={`
                                                    calender-detail-left-date
                                                    ${green  ? "green" : ""}
                                                    ${filled ? "filled" : ""}
                                                    ${outline ? "outline" : ""}
                                                `}
                                            >
                                                {item.date}
                                            </div>

                                            <img
                                                className="calender-detail-left-add"
                                                src={AddIcon}
                                                alt="add_icon"
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                        </div>

                        {/* RIGHT */}
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
                                <div className="calender-detail-right-bottom-first"></div>
                                <div className="calender-detail-right-bottom-second"></div>
                                <div className="calender-detail-right-bottom-third"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ✅ ADD */}
            {modalType === "add" && (
                <AddCalenderModal
                    date={selectedDate}
                    onClose={() => setModalType(null)}
                    onSuccess={() => setModalType("success")}
                />
            )}

            {/* ✅ EDIT */}
            {modalType === "edit" && (
                <EditCalenderModal
                    date={selectedDate}
                    onClose={() => setModalType(null)}
                />
            )}

            {/* ✅ MATCHUP */}
            {modalType === "matchup" && (
                <MatchupCalenderModal
                    date={selectedDate}
                    onClose={() => setModalType(null)}
                />
            )}

            {/* ✅ SUCCESS */}
            {modalType === "success" && (
                <SuccessModal
                    message="성공적으로 저장되었습니다."
                    onConfirm={() => setModalType(null)}
                />
            )}
        </>
    );
};

export default ClubCalenderDetailPage;
