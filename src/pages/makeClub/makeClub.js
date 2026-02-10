import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./makeClub.css";
import mainLogo from "../../assets/mainLogo.png";
import editIcon from "../../assets/Edit.svg";

export default function MakeClub() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    clubName: "",
    description: "",
    region: "",
    sportCategory: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 필수 입력값 체크
  const isFormValid =
    form.clubName && form.description && form.region && form.sportCategory;

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // 필수 입력값 검증
    if (
      !form.clubName ||
      !form.description ||
      !form.region ||
      !form.sportCategory
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    // localStorage에서 개인정보 가져오기
    const userInfoStr = localStorage.getItem("userRegistrationInfo");
    if (!userInfoStr) {
      alert("개인정보가 없습니다. 회원가입 첫 단계부터 다시 진행해주세요.");
      navigate("/register");
      return;
    }

    setIsLoading(true);

    const userInfo = JSON.parse(userInfoStr);

    // 전체 데이터 준비 (개인정보 + 동아리 정보)
    const registrationData = {
      ...userInfo,
      clubName: form.clubName,
      description: form.description,
      region: form.region,
      sportCategory: form.sportCategory,
    };

    try {
      console.log("회원가입 요청 데이터:", registrationData);

      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/club/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(registrationData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입에 실패했습니다.");
      }

      const result = await response.json();
      console.log("회원가입 성공:", result);

      // localStorage 정리
      localStorage.removeItem("userRegistrationInfo");

      alert("회원가입이 완료되었습니다!");

      // 성공 시 로그인 페이지로 이동
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert(`회원가입에 실패했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="club-container">
      <div className="club-content">
        <div className="club-title">
          <img src={mainLogo} alt="mainLogo" className="club-title-logo" />
          <span>동아리 생성</span>
        </div>

        {/* 프로필 이미지 업로드 영역 */}
        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            <div className="profile-circle">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="프로필 미리보기"
                  className="profile-preview"
                />
              ) : (
                <img
                  src={mainLogo}
                  alt="기본 로고"
                  className="profile-logo-placeholder"
                />
              )}
            </div>
            <label htmlFor="profile-upload" className="profile-edit-btn">
              <img
                src={editIcon}
                alt="프로필 편집"
                className="profile-edit-icon"
              />
            </label>
          </div>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={onImageChange}
            className="profile-upload-input"
          />
        </div>

        <form className="club-form" onSubmit={onSubmit}>
          <div className="club-field">
            <label className="club-label">
              동아리 이름<span className="club-req">*</span>
            </label>
            <input
              className="club-input"
              name="clubName"
              value={form.clubName}
              onChange={onChange}
              placeholder="동아리 이름을 입력하세요"
            />
          </div>

          <div className="club-field">
            <label className="club-label">
              동아리 소개<span className="club-req">*</span>
            </label>
            <textarea
              className="club-textarea"
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="동아리에 대해 소개해주세요"
              rows={5}
            />
          </div>

          <div className="club-field">
            <label className="club-label">
              지역<span className="club-req">*</span>
            </label>
            <select
              className="club-input"
              name="region"
              value={form.region}
              onChange={onChange}
            >
              <option value="">지역을 선택하세요</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="광주">광주</option>
              <option value="대전">대전</option>
              <option value="울산">울산</option>
              <option value="세종">세종</option>
              <option value="강원">강원</option>
              <option value="충북">충북</option>
              <option value="충남">충남</option>
              <option value="전북">전북</option>
              <option value="전남">전남</option>
              <option value="경북">경북</option>
              <option value="경남">경남</option>
              <option value="제주">제주</option>
            </select>
          </div>

          <div className="club-field">
            <label className="club-label">
              운동 종목<span className="club-req">*</span>
            </label>
            <select
              className="club-input"
              name="sportCategory"
              value={form.sportCategory}
              onChange={onChange}
            >
              <option value="">운동 종목을 선택하세요</option>
              <option value="축구">축구</option>
              <option value="농구">농구</option>
              <option value="야구">야구</option>
              <option value="배구">배구</option>
              <option value="테니스">테니스</option>
              <option value="배드민턴">배드민턴</option>
              <option value="탁구">탁구</option>
              <option value="수영">수영</option>
              <option value="런닝">런닝</option>
              <option value="클라이밍">클라이밍</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <button
            className={`club-submit ${isFormValid ? "active" : ""}`}
            type="submit"
          >
            동아리 생성
          </button>
        </form>
      </div>
    </div>
  );
}
