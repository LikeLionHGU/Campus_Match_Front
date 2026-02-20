import { useState } from "react";
import "./Calender.css";

import leftArrow from "../../../assets/arrow_left.svg";
import rightArrow from "../../../assets/arrow_right.svg";

const Calender = ({ schedules = [],
  upcomingMatches = [],
  ongoingMatches = [],
  matchRequests = []
 }) => {

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();


  const filledDates = [...upcomingMatches, ...ongoingMatches].map(match => {
    const date = new Date(match.matchDate);

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    };
  });


  const outlineDates = matchRequests.map(match => {
    const date = new Date(match.matchDate);

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    };
  });


  const scheduleDates = schedules.flatMap(schedule => {
    const start = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);

    const dates = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push({
        year: current.getFullYear(),
        month: current.getMonth(),
        day: current.getDate(),
      });

      current.setDate(current.getDate() + 1);
    }

    return dates;
  });

  

  const dates = [];

  
  const prevLastDate = new Date(year, month, 0).getDate();

 
  for (let i = startDay - 1; i >= 0; i--) {
    dates.push({
      day: prevLastDate - i,
      isCurrentMonth: false,
    });
  }


  for (let i = 1; i <= lastDate; i++) {
    dates.push({
      day: i,
      isCurrentMonth: true,
    });
  }

 
  let nextDay = 1;
  while (dates.length < 42) {
    dates.push({
      day: nextDay++,
      isCurrentMonth: false,
    });
  }

 

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

 

  return (
    <div className="calendar">

      <div className="calendar-header">

        <img
          src={leftArrow}
          alt="prev"
          className="arrow"
          onClick={prevMonth}
        />

        <span className="calendar-title">
          {year}년 {month + 1}월
        </span>

        <img
          src={rightArrow}
          alt="next"
          className="arrow"
          onClick={nextMonth}
        />

      </div>

      <div className="calendar-week">
        {["일","월","화","수","목","금","토"].map((d) => (
          <div key={d} className="week-item">{d}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {dates.map((item, idx) => {

          const date = item.day;
          const isCurrentMonth = item.isCurrentMonth;


          const filled =
            isCurrentMonth &&
            filledDates.some(
              (d) =>
                d.year === year &&
                d.month === month &&
                d.day === date
            );

          const hasSchedule =
            isCurrentMonth &&
            scheduleDates.some(
              (d) =>
                d.year === year &&
                d.month === month &&
                d.day === date
            );  

          const outline =
            isCurrentMonth &&
            outlineDates.some(
              (d) =>
                d.year === year &&
                d.month === month &&
                d.day === date
          );


          return (
            <div key={idx} className="calendar-cell">
              <div
                className={`
                  date-circle
                  ${!isCurrentMonth ? "other-month" : ""}
                  ${hasSchedule ? "schedule" : ""}
                  ${filled ? "filled" : ""}
                  ${outline ? "outline" : ""}
                `}
              >
                {date}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Calender;
