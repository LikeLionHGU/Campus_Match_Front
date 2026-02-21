import { useState, useMemo } from "react";
import "./Calender.css";

import leftArrow from "../../../assets/arrow_left.svg";
import rightArrow from "../../../assets/arrow_right.svg";

const Calender = ({
  schedules = [],
  upcomingMatches = [],
  ongoingMatches = [],
  matchRequests = [],
}) => {

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  // ✅ filled 날짜 Set (upcoming + ongoing)
  const filledSet = useMemo(() => {
    const set = new Set();

    [...upcomingMatches, ...ongoingMatches].forEach(match => {
      const date = new Date(match.matchDate);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      set.add(key);
    });

    return set;
  }, [upcomingMatches, ongoingMatches]);


  // ✅ outline 날짜 Set
  const outlineSet = useMemo(() => {
    const set = new Set();

    matchRequests.forEach(match => {
      const date = new Date(match.matchDate);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      set.add(key);
    });

    return set;
  }, [matchRequests]);


  // ✅ schedule 날짜 Set (기간 포함)
  const scheduleSet = useMemo(() => {
    const set = new Set();

    schedules.forEach(schedule => {
      const start = new Date(schedule.startDate);
      const end = new Date(schedule.endDate);

      const current = new Date(start);

      while (current <= end) {
        const key = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`;
        set.add(key);
        current.setDate(current.getDate() + 1);
      }
    });

    return set;
  }, [schedules]);


  // 캘린더 날짜 생성
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
          onClick={(e) => {
            e.stopPropagation();
            prevMonth();
          }}
        />

        <span className="calendar-title">
          {year}년 {month + 1}월
        </span>

        <img
          src={rightArrow}
          alt="next"
          className="arrow"
          onClick={(e) => {
            e.stopPropagation();
            nextMonth();
          }}
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

          const key = `${year}-${month}-${date}`;

          const filled =
            isCurrentMonth && filledSet.has(key);

          const outline =
            isCurrentMonth && outlineSet.has(key);

          const hasSchedule =
            isCurrentMonth && scheduleSet.has(key);


          let priorityClass = "";

          if (filled) {
            priorityClass = "filled";

          } else if (outline) {
            priorityClass = "outline";

          } else if (hasSchedule) {
            priorityClass = "schedule";
          }


          return (
            <div key={idx} className="calendar-cell">

              <div
                className={`
                  date-circle
                  ${!isCurrentMonth ? "other-month" : ""}
                  ${priorityClass}
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