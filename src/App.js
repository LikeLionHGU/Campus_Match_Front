import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import MakeClub from "./pages/makeClub/makeClub";
import LoginPage from "./pages/login_page/Login_page";
import RegisterPage from "./pages/register_page/Register_page";
import MyPage from "./pages/MyPage/MyPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import DetailGallery from "./pages/Dashboard/Dashboard_Pages/ClubGalleryDetailPage/ClubGalleryDetailPage";
import DetailRecord from "./pages/Dashboard/Dashboard_Pages/ClubRecordDetailPage/ClubRecordDetailPage";
import DetailCalender from "./pages/Dashboard/Dashboard_Pages/ClubCalenderDetailPage/ClubCalenderDetailPage";
import MatchupBoardPage from "./pages/Matchup_Board_Page/MatchupBoardPage";
import ClubBoardPage from "./pages/Club_Board_Page/ClubBoardPage";
import UpcomingMatchupPage from "./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/UpcomingMatchupPage/UpcomingMatchupPage";
import OngoingMatchupPage from "./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/OngoingMatchupPage/OngoingMatchupPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/makeClub" element={<MakeClub />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/record" element={<DetailRecord />} />
        <Route path="/dashboard/upcoming-matchup" element={<UpcomingMatchupPage />} />
        <Route path="/dashboard/ongoing-matchup" element={<OngoingMatchupPage />} />
        <Route path="/dashboard/calender" element={<DetailCalender />} />
        <Route path="/dashboard/gallery" element={<DetailGallery />} />
        <Route path="/matchup-board" element={<MatchupBoardPage />} />
        <Route path="/club-board" element={<ClubBoardPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
