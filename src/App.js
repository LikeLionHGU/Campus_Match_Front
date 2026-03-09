import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import MakeClub from "./pages/makeClub/makeClub";
import LoginPage from "./pages/login_page/Login_page";
import RegisterPage from "./pages/register_page/Register_page";
import MyPage from "./pages/MyPage/MyPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import MatchupBoardPage from "./pages/Matchup_Board_Page/MatchupBoardPage";
import ClubSearchBoardPage from "./pages/ClubSearchBoardPage/ClubSearchBoardPage";
import DetailGallery from "./pages/Dashboard/Dashboard_Pages/ClubGalleryDetailPage/ClubGalleryDetailPage";
import MatchupHistoryPage from "./pages/Dashboard/Dashboard_Pages/MatchupHistory/MatchupHistoryPage";
import DetailCalender from "./pages/Dashboard/Dashboard_Pages/ClubCalenderDetailPage/ClubCalenderDetailPage";
import UpcomingMatchupPage from "./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/UpcomingMatchupPage/UpcomingMatchupPage";
import OngoingMatchupPage from "./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/OngoingMatchupPage/OngoingMatchupPage";
import ReceiveMatchupPage from "./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/RecieveMatchupPage/ReceiveMatchupPage";
import SendMatchupPage from "./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/SendMatchupPage/SendMatchupPage";
import FinishMatchupPage from "./pages/FinishMatchup/FinishMatchupPage";
import LandingPage from "./pages/LandingPage/LandingPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  function Layout() {
    const location = useLocation();
    const isLanding = location.pathname === "/";
    return (
      <>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/makeClub" element={<MakeClub />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/record" element={<MatchupHistoryPage />} />
          <Route
            path="/dashboard/upcoming-matchup"
            element={<UpcomingMatchupPage />}
          />
          <Route
            path="/dashboard/ongoing-matchup"
            element={<OngoingMatchupPage />}
          />
          <Route
            path="/dashboard/receive-matchup"
            element={<ReceiveMatchupPage />}
          />
          <Route path="/dashboard/send-matchup" element={<SendMatchupPage />} />
          <Route path="/dashboard/calender" element={<DetailCalender />} />
          <Route path="/dashboard/gallery" element={<DetailGallery />} />
          <Route path="/matchup-board" element={<MatchupBoardPage />} />
          <Route path="/club-board" element={<ClubSearchBoardPage />} />
          <Route path="/finish-matchup" element={<FinishMatchupPage />} />
          <Route path="/club-board/dashboard/:clubId" element={<Dashboard />} />
          <Route
            path="/club-board/dashboard/:clubId/calender"
            element={<DetailCalender />}
          />
        </Routes>
        {!isLanding && <Footer />}
      </>
    );
  }

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
