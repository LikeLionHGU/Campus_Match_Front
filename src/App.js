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
import DetailMatchup from "./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/ClubMatchupDetailPage";
import Matchup_Board_Page from "./pages/Matchup_Board_Page/Matchup_Board_Page";
import Club_Board_Page from "./pages/Club_Board_Page/Club_Board_Page";

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
        <Route path="/dashboard/matchup" element={<DetailMatchup />} />
        <Route path="/dashboard/calender" element={<DetailCalender />} />
        <Route path="/dashboard/gallery" element={<DetailGallery />} />
        <Route path="/matchup-board" element={<Matchup_Board_Page />} />
        <Route path="/club-board" element={<Club_Board_Page />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
