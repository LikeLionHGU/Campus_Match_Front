import "./Matchup.css";
import { useNavigate } from "react-router-dom";

const MAX_ROWS = 4;

const fillRows = (list, count) => {
  const rows = [...list];
  while (rows.length < count) rows.push(null);
  return rows.slice(0, count);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.replace(/-/g, ".");
};

const truncate = (str, n = 10) => {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "..." : str;
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
                    <th>동아리</th>
                  </tr>
                </thead>
                <tbody>
                  {fillRows(upcomingList, MAX_ROWS).map((item, i) => (
                    <tr key={i} className={i === 0 ? "matchup-first-row" : ""}>
                      <td>{formatDate(item?.matchDate)}</td>
                      <td>
                        {item
                          ? truncate(item.clubName)
                          : ""}
                      </td>
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
                    <th>동아리</th>
                  </tr>
                </thead>
                <tbody>
                  {fillRows(ongoingList, MAX_ROWS).map((item, i) => (
                    <tr key={i} className={i === 0 ? "matchup-first-row" : ""}>
                      <td>{formatDate(item?.matchDate)}</td>
                      <td>
                        {item
                          ? truncate(item.clubName)
                          : ""}
                      </td>
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
                  <th>동아리</th>
                  <th>종목</th>
                  <th>매치온도</th>
                </tr>
              </thead>
              <tbody>
                {fillRows(receiveList, MAX_ROWS).map((item, i) => (
                  <tr key={i} className={i === 0 ? "matchup-first-row" : ""}>
                    <td>{formatDate(item?.matchDate)}</td>
                    <td>
                      {item
                        ? truncate(item.clubName)
                        : ""}
                    </td>
                    <td>{item?.sportCategory || ""}</td>
                    <td>{item?.mannerScore ? `${item.mannerScore}°C` : ""}</td>
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
                  <th>동아리</th>
                  <th>종목</th>
                  <th>매치온도</th>
                </tr>
              </thead>
              <tbody>
                {fillRows(sendList, MAX_ROWS).map((item, i) => (
                  <tr key={i} className={i === 0 ? "matchup-first-row" : ""}>
                    <td>{formatDate(item?.matchDate)}</td>
                    <td>
                      {item
                        ? truncate(item.clubName)
                        : ""}
                    </td>
                    <td>{item?.sportCategory || ""}</td>
                    <td>{item?.mannerScore ? `${item.mannerScore}°C` : ""}</td>
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
