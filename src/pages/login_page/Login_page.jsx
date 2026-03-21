import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login_page.css";
import mainLogo from "../../assets/mainLogo.png";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = form.username && form.password;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      
      return;
    }

    setIsLoading(true);

    try {
      const loginResponse = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        },
      );

      if (!loginResponse.ok) {
        throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
      }

      const loginData = await loginResponse.json().catch(() => ({}));
      const refreshToken =
        loginData.RefreshToken || loginResponse.headers.get("RefreshToken");

      if (!refreshToken || refreshToken === "" || Number(refreshToken) <= 0) {
        throw new Error("계정이 존재하지 않거나 잘못된 정보입니다.");
      }

      localStorage.setItem("RefreshToken", refreshToken);

      if (loginData.clubId) {
        localStorage.setItem("clubId", loginData.clubId);
      }

      const authResponse = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            RefreshToken: refreshToken,
          },
        },
      );

      if (!authResponse.ok) {
        throw new Error("사용자 정보를 불러오는데 실패했습니다.");
      }

      const authData = await authResponse.json().catch(() => ({}));

      const accessToken =
        authResponse.headers.get("Authorization") || authData.Authorization;

      if (accessToken) {
        localStorage.setItem("Authorization", accessToken);
      }

      if (!loginData.clubId) {
        try {
          const infoRes = await fetch(
            `${import.meta.env.VITE_HOST_URL}/api/club/info`,
            {
              method: "GET",
              headers: {
                Authorization: accessToken || "",
                "Content-Type": "application/json",
              },
            },
          );
          if (infoRes.ok) {
            const infoData = await infoRes.json();
            if (infoData.clubId) {
              localStorage.setItem("clubId", infoData.clubId);
            }
          }
        } catch (err) {
          console.error("Failed to fetch club id during login", err);
        }
      }

      alert("로그인 성공!");
      navigate("/dashboard");
    } catch (error) {
      alert("로그인 실패!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-frame">
        <div className="login-title">
          <img src={mainLogo} alt="mainLogo" className="login-title-logo" />
          <span>로그인</span>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <input
            className="login-input"
            placeholder="아이디"
            name="username"
            value={form.username}
            onChange={onChange}
          />
          <input
            className="login-input"
            type="password"
            placeholder="비밀번호"
            name="password"
            value={form.password}
            onChange={onChange}
          />
          <button
            className={`login-button ${isFormValid ? "active" : ""}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
