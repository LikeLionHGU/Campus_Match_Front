import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register_page.css";
import mainLogo from "../../assets/mainLogo.png";
import Modal from "../../components/Modal/Modal";
import UniversityModal from "./UniversityModal/UniversityModal";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showUnivModal, setShowUnivModal] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
  });

  const [isIdValid, setIsIdValid] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailToken, setEmailToken] = useState("");

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
    if (name === "username") setIsIdValid(false);
    if (name === "email") {
      setIsEmailSent(false);
      setIsEmailVerified(false);
    }
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
    form.email &&
    isIdValid &&
    isEmailVerified;

  const handleIdCheck = async () => {
    if (!form.username) {
      setModal({ isOpen: true, message: "아이디를 입력해주세요." });
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/club/isValidId?username=${form.username}`,
        { method: "POST" },
      );
      const data = await response.json();
      if (!data.isValidId) {
        setIsIdValid(true);
        setModal({ isOpen: true, message: "사용 가능한 아이디입니다." });
      } else {
        setIsIdValid(false);
        setForm((prev) => ({ ...prev, username: "" }));
        setModal({ isOpen: true, message: "이미 사용 중인 아이디입니다." });
      }
    } catch (error) {
      console.error("아이디 중복 확인 오류", error);
      setModal({
        isOpen: true,
        message: "아이디 중복 확인 중 오류가 발생했습니다.",
      });
    }
  };

  const handleEmailRequest = async () => {
    if (!form.email) {
      setModal({ isOpen: true, message: "이메일을 입력해주세요." });
      return;
    }
    setIsEmailSending(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/club/email/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        },
      );
      if (response.ok) {
        setIsEmailSent(true);
        setModal({
          isOpen: true,
          message: "인증 코드가 이메일로 전송되었습니다.",
        });
      } else {
        setModal({ isOpen: true, message: "이메일 전송에 실패했습니다." });
      }
    } catch (error) {
      console.error("이메일 전송 오류", error);
      setModal({
        isOpen: true,
        message: "이메일 전송 중 오류가 발생했습니다.",
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleEmailConfirm = async () => {
    if (!emailCode) {
      setModal({ isOpen: true, message: "인증 코드를 입력해주세요." });
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL}/api/club/email/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, code: emailCode }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        setIsEmailVerified(true);
        setEmailToken(data.verificationToken);
        setModal({ isOpen: true, message: "이메일 인증이 완료되었습니다." });
      } else {
        setModal({ isOpen: true, message: "인증 코드가 올바르지 않습니다." });
      }
    } catch (error) {
      console.error("이메일 인증 오류", error);
      setModal({
        isOpen: true,
        message: "이메일 인증 중 오류가 발생했습니다.",
      });
    }
  };

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

    if (!isIdValid) {
      setModal({ isOpen: true, message: "아이디 중복 확인을 해주세요." });
      return;
    }

    if (!isEmailVerified) {
      setModal({ isOpen: true, message: "이메일 인증을 완료해주세요." });
      return;
    }

    const userInfo = {
      username: form.username,
      password: form.password,
      name: form.name,
      university: form.university,
      phone: `${form.phone1}-${form.phone2}-${form.phone3}`,
      email: form.email,
      emailVerificationToken: emailToken,
    };

    localStorage.setItem("userRegistrationInfo", JSON.stringify(userInfo));

    navigate("/makeClub");
  };

  return (
    <>
      <div className="register-container">
        <Modal
          isOpen={modal.isOpen}
          message={modal.message}
          onConfirm={() => setModal({ isOpen: false, message: "" })}
        />

        <div className="register-content">
          <div className="register-title">
            <img
              src={mainLogo}
              alt="mainLogo"
              className="register-title-logo"
            />
            <span>회원가입</span>
          </div>

          <form className="register-form" onSubmit={onSubmit}>
            <div className="register-field">
              <label className="register-label">
                아이디<span className="register-req">*</span>
              </label>
              <div className="row">
                <input
                  className="register-input"
                  name="username"
                  value={form.username}
                  onChange={onChange}
                />
                <button
                  onClick={handleIdCheck}
                  className="register-btn"
                  type="button"
                >
                  중복확인
                </button>
              </div>
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
                  readOnly
                />
                <button
                  onClick={() => setShowUnivModal(true)}
                  className="register-btn"
                  type="button"
                >
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
              <div className="row">
                <input
                  className="register-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  readOnly={isEmailVerified}
                  style={
                    isEmailVerified
                      ? { backgroundColor: "#f0f0f0", color: "#999" }
                      : {}
                  }
                />
                <button
                  onClick={handleEmailRequest}
                  className="register-btn"
                  type="button"
                  disabled={isEmailSending || isEmailVerified}
                  style={
                    isEmailVerified || isEmailSending
                      ? {
                          backgroundColor: "#d6d6d6",
                          cursor: "default",
                          fontSize: "0.833vw",
                        }
                      : { fontSize: "0.833vw" }
                  }
                >
                  {isEmailVerified
                    ? "완료"
                    : isEmailSending
                      ? "전송중"
                      : "인증요청"}
                </button>
              </div>
              {isEmailSent && !isEmailVerified && (
                <div className="row" style={{ marginTop: "0.521vw" }}>
                  <input
                    className="register-input"
                    placeholder="인증 코드를 입력하세요"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                  />
                  <button
                    onClick={handleEmailConfirm}
                    className="register-btn"
                    type="button"
                    style={{ fontSize: "0.833vw" }}
                  >
                    확인
                  </button>
                </div>
              )}
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
      {showUnivModal && (
        <UniversityModal
          onClose={() => setShowUnivModal(false)}
          onSelect={(universityName) => {
            setForm((prev) => ({
              ...prev,
              university: universityName,
            }));
            setShowUnivModal(false);
          }}
        />
      )}
    </>
  );
}
