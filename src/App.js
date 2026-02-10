import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import MakeClub from "./pages/makeClub/makeClub";
import LoginPage from "./pages/login_page/Login_page";
import RegisterPage from "./pages/register_page/Register_page";
import MyPage from "./pages/MyPage/MyPage";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/makeClub" element={<MakeClub />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
