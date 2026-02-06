import { useState } from "react";
import "./Register_page.css";
import mainLogo from "../../assets/mainLogo.png"
export default function RegisterPage() {
  const [form, setForm] = useState({
    userId: "",
    password: "",
    name: "",
    university: "",
    club: "",
    phone1: "",
    phone2: "",
    phone3: "",
    email: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
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
              name="userId"
              value={form.userId}
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
              value={form.email}
              onChange={onChange}
            />
          </div>

          <button className="submit" type="submit">
            회원가입
          </button>
        </form>
      </div>
    </div >
  );
}
