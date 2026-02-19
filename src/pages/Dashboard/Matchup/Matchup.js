import "./Matchup.css";
import { useNavigate } from "react-router-dom";

const MAX_ROWS = 4;

const fillRows = (list, count) => {
  const rows = [...list];
  while (rows.length < count) rows.push(null);
  return rows.slice(0, count);
};

const Matchup = ({
  upcomingList = [],
  ongoingList = [],
  receiveList = [],
  sendList = [],
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="matchup-frame">
        <div className="matchup-top">
          <div
            className="matchup-top-left"
            onClick={() => navigate("/dashboard/upcoming-matchup")}
          >
            <div className="matchup-top-left-header">
              <span>예정된 매치업</span>
            </div>
            <div className="matchup-top-left-content">
              <table>
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>동아리/대학</th>
                  </tr>
                </thead>
                <tbody>
                  {fillRows(upcomingList, MAX_ROWS).map((item, i) => (
                    <tr key={i} className={i === 0 ? "matchup-first-row" : ""}>
                      <th>{item?.matchDate || ""}</th>
                      <th>
                        {item
                          ? `${item.clubName || ""}/${item.university || ""}`
                          : ""}
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div
            className="matchup-top-right"
            onClick={() => navigate("/dashboard/ongoing-matchup")}
          >
            <div className="matchup-top-right-header">
              <span>진행중인 매치업</span>
            </div>
            <div className="matchup-top-right-content">
              <table>
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>동아리/대학</th>
                  </tr>
                </thead>
                <tbody>
                  {fillRows(ongoingList, MAX_ROWS).map((item, i) => (
                    <tr key={i} className={i === 0 ? "matchup-first-row" : ""}>
                      <th>{item?.matchDate || ""}</th>
                      <th>
                        {item
                          ? `${item.clubName || ""}/${item.university || ""}`
                          : ""}
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          className="matchup-middle"
          onClick={() => navigate("/dashboard/receive-matchup")}
        >
          <div className="matchup-middle-header">
            <span>제안받은 매치업</span>
          </div>
          <div className="matchup-middle-content">
            <table>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>동아리/대학</th>
                  <th>종목</th>
                  <th>매치온도</th>
                </tr>
              </thead>
              <tbody>
                {fillRows(receiveList, MAX_ROWS).map((item, i) => (
                  <tr key={i} className={i === 0 ? "matchup-first-row" : ""}>
                    <th>{item?.matchDate || ""}</th>
                    <th>
                      {item
                        ? `${item.clubName || ""}/${item.university || ""}`
                        : ""}
                    </th>
                    <th>{item?.sportsType || ""}</th>
                    <th>{item?.mannerScore ? `${item.mannerScore}°C` : ""}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="matchup-bottom"
          onClick={() => navigate("/dashboard/send-matchup")}
        >
          <div className="matchup-bottom-header">
            <span>제안한 매치업</span>
          </div>
          <div className="matchup-bottom-content">
            <table>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>동아리/대학</th>
                  <th>종목</th>
                  <th>매치온도</th>
                </tr>
              </thead>
              <tbody>
                {fillRows(sendList, MAX_ROWS).map((item, i) => (
                  <tr key={i} className={i === 0 ? "matchup-first-row" : ""}>
                    <th>{item?.matchDate || ""}</th>
                    <th>
                      {item
                        ? `${item.clubName || ""}/${item.university || ""}`
                        : ""}
                    </th>
                    <th>{item?.sportsType || ""}</th>
                    <th>{item?.mannerScore ? `${item.mannerScore}°C` : ""}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default Matchup;
