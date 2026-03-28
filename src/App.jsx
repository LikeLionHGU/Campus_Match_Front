import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";

const MakeClub = lazy(() => import("./pages/makeClub/makeClub"));
const LoginPage = lazy(() => import("./pages/login_page/Login_page"));
const RegisterPage = lazy(() => import("./pages/register_page/Register_page"));
const MyPage = lazy(() => import("./pages/MyPage/MyPage"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const MatchupBoardPage = lazy(() => import("./pages/Matchup_Board_Page/MatchupBoardPage"));
const ClubSearchBoardPage = lazy(() => import("./pages/ClubSearchBoardPage/ClubSearchBoardPage"));
const DetailGallery = lazy(() => import("./pages/Dashboard/Dashboard_Pages/ClubGalleryDetailPage/ClubGalleryDetailPage"));
const MatchupHistoryPage = lazy(() => import("./pages/Dashboard/Dashboard_Pages/MatchupHistory/MatchupHistoryPage"));
const DetailCalendar = lazy(() => import("./pages/Dashboard/Dashboard_Pages/ClubCalendarDetailPage/ClubCalendarDetailPage"));
const UpcomingMatchupPage = lazy(() => import("./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/UpcomingMatchupPage/UpcomingMatchupPage"));
const OngoingMatchupPage = lazy(() => import("./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/OngoingMatchupPage/OngoingMatchupPage"));
const ReceiveMatchupPage = lazy(() => import("./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/RecieveMatchupPage/ReceiveMatchupPage"));
const SendMatchupPage = lazy(() => import("./pages/Dashboard/Dashboard_Pages/ClubMatchupDetailPage/SendMatchupPage/SendMatchupPage"));
const FinishMatchupPage = lazy(() => import("./pages/FinishMatchup/FinishMatchupPage"));

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
        <Suspense fallback={null}>
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
          <Route path="/dashboard/calendar" element={<DetailCalendar />} />
          <Route path="/dashboard/gallery" element={<DetailGallery />} />
          <Route path="/matchup-board" element={<MatchupBoardPage />} />
          <Route path="/club-board" element={<ClubSearchBoardPage />} />
          <Route path="/finish-matchup" element={<FinishMatchupPage />} />
          <Route path="/club-board/dashboard/:clubId" element={<Dashboard />} />
          <Route
            path="/club-board/dashboard/:clubId/calendar"
            element={<DetailCalendar />}
          />
        </Routes>
        </Suspense>
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
