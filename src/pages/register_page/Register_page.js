import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register_page.css";
import mainLogo from "../../assets/mainLogo.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    university: "",
    phone1: "",
    phone2: "",
    phone3: "",
    email: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    form.username &&
    form.password &&
    form.name &&
    form.university &&
    form.phone1 &&
    form.phone2 &&
    form.phone3 &&
    form.email;

  const onSubmit = (e) => {
    e.preventDefault();

    if (
      !form.username ||
      !form.password ||
      !form.name ||
      !form.university ||
      !form.email
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (!form.phone1 || !form.phone2 || !form.phone3) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    const userInfo = {
      username: form.username,
      password: form.password,
      name: form.name,
      university: form.university,
      phone: `${form.phone1}-${form.phone2}-${form.phone3}`,
      email: form.email,
    };

    localStorage.setItem("userRegistrationInfo", JSON.stringify(userInfo));
    console.log("개인정보 저장 완료:", userInfo);

    navigate("/makeClub");
  };

  return (
    <div className="container">
      <div className="content">
        <div className="title">
          <img src={mainLogo} alt="mainLogo" className="title-logo" />
          <span>회원가입</span>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label className="label">
              아이디<span className="req">*</span>
            </label>
            <input
              className="input"
              name="username"
              value={form.username}
              onChange={onChange}
            />
          </div>

          <div className="field">
            <label className="label">
              비밀번호<span className="req">*</span>
            </label>
            <input
              className="input"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
            />
          </div>

          <div className="field">
            <label className="label">
              이름<span className="req">*</span>
            </label>
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={onChange}
            />
          </div>

          <div className="field">
            <label className="label">
              대학<span className="req">*</span>
            </label>
            <div className="row">
              <input
                className="input"
                name="university"
                value={form.university}
                onChange={onChange}
              />
              <button className="btn" type="button">
                찾기
              </button>
            </div>
          </div>

          <div className="field">
            <label className="label">
              전화번호<span className="req">*</span>
            </label>
            <div className="phone">
              <input
                className="input phone-input"
                name="phone1"
                value={form.phone1}
                onChange={onChange}
                maxLength={3}
              />
              <span className="dash"></span>
              <input
                className="input phone-input"
                name="phone2"
                value={form.phone2}
                onChange={onChange}
                maxLength={4}
              />
              <span className="dash"></span>
              <input
                className="input phone-input"
                name="phone3"
                value={form.phone3}
                onChange={onChange}
                maxLength={4}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">
              이메일<span className="req">*</span>
            </label>
            <input
              className="input"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
            />
          </div>

          <button
            className={`submit ${isFormValid ? "active" : ""}`}
            type="submit"
          >
            다음
          </button>
        </form>
      </div>
    </div>
  );
}
