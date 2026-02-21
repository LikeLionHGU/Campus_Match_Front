import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register_page.css";
import mainLogo from "../../assets/mainLogo.png";
import Modal from "../../components/Modal/Modal";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
  });

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
      setModal({ isOpen: true, message: "모든 필수 항목을 입력해주세요." });
      return;
    }

    if (!form.phone1 || !form.phone2 || !form.phone3) {
      setModal({ isOpen: true, message: "전화번호를 입력해주세요." });
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

    navigate("/makeClub");
  };

  return (
    <div className="register-container">
      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        onConfirm={() => setModal({ isOpen: false, message: "" })}
      />

      <div className="register-content">
        <div className="register-title">
          <img src={mainLogo} alt="mainLogo" className="register-title-logo" />
          <span>회원가입</span>
        </div>

        <form className="register-form" onSubmit={onSubmit}>
          <div className="register-field">
            <label className="register-label">
              아이디<span className="register-req">*</span>
            </label>
            <input
              className="register-input"
              name="username"
              value={form.username}
              onChange={onChange}
            />
          </div>

          <div className="register-field">
            <label className="register-label">
              비밀번호<span className="register-req">*</span>
            </label>
            <input
              className="register-input"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
            />
          </div>

          <div className="register-field">
            <label className="register-label">
              이름<span className="register-req">*</span>
            </label>
            <input
              className="register-input"
              name="name"
              value={form.name}
              onChange={onChange}
            />
          </div>

          <div className="register-field">
            <label className="register-label">
              대학<span className="register-req">*</span>
            </label>
            <div className="row">
              <input
                className="register-input"
                name="university"
                value={form.university}
                onChange={onChange}
              />
              <button className="register-btn" type="button">
                찾기
              </button>
            </div>
          </div>

          <div className="register-field">
            <label className="register-label">
              전화번호<span className="register-req">*</span>
            </label>
            <div className="phone">
              <input
                className="register-input phone-input"
                name="phone1"
                value={form.phone1}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  onChange(e);
                }}
                maxLength={3}
              />
              <span className="dash"></span>
              <input
                className="register-input phone-input"
                name="phone2"
                value={form.phone2}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  onChange(e);
                }}
                maxLength={4}
              />
              <span className="dash"></span>
              <input
                className="register-input phone-input"
                name="phone3"
                value={form.phone3}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  onChange(e);
                }}
                maxLength={4}
              />
            </div>
          </div>

          <div className="register-field">
            <label className="register-label">
              이메일<span className="register-req">*</span>
            </label>
            <input
              className="register-input"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
            />
          </div>

          <button
            className={`submit ${isFormValid ? "active" : ""}`}
            type="submit"
            disabled={!isFormValid}
          >
            다음
          </button>
        </form>
      </div>
    </div>
  );
}
