import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./makeClub.css";
import mainLogo from "../../assets/mainLogo.png";
import editIcon from "../../assets/Edit.svg";
import Modal from "../../components/Modal/Modal";
import CustomSelect from "../../components/Dropdown/Dropdown";

export default function MakeClub() {
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    subtitle: "",
    onConfirm: null,
  });

  const [form, setForm] = useState({
    clubName: "",
    description: "",
    region: "",
    sportCategory: "",
  });
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    form.clubName && form.description && form.region && form.sportCategory;

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.clubName ||
      !form.description ||
      !form.region ||
      !form.sportCategory
    ) {
      setModal({
        isOpen: true,
        message: "모든 필수 항목을 입력해주세요.",
      });
      return;
    }

    const userInfoStr = localStorage.getItem("userRegistrationInfo");
    if (!userInfoStr) {
      setModal({
        isOpen: true,
        message: "개인정보가 없습니다.",
        subtitle: "회원가입 첫 단계부터 다시 진행해주세요.",
        onConfirm: () => navigate("/register"),
      });
      return;
    }

    setIsLoading(true);

    try {
      let uploadedImageUrl = null;

      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append("profileImage", profileImage);

        const imageResponse = await fetch(
          `${process.env.REACT_APP_HOST_URL}/api/club/upload-profile-image`,
          {
            method: "POST",
            body: imageFormData,
          },
        );

        if (imageResponse.ok) {
          const imageResult = await imageResponse.json();
          uploadedImageUrl = imageResult.imageUrl;
        } else {
        }
      }

      const userInfo = JSON.parse(userInfoStr);

      const registrationData = {
        ...userInfo,
        clubName: form.clubName,
        description: form.description,
        region: form.region,
        sportCategory: form.sportCategory,
      };

      if (uploadedImageUrl) {
        registrationData.profileImageUrl = uploadedImageUrl;
      }

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

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        localStorage.removeItem("userRegistrationInfo");
        if (data.clubId) {
          localStorage.setItem("clubId", data.clubId);
        }
        setModal({
          isOpen: true,
          message: "동아리 등록이 완료되었습니다!",
          onConfirm: () => navigate("/myPage"),
        });
      } else {
        setModal({
          isOpen: true,
          message: "동아리 등록이 실패했습니다!",
          subtitle: data.message || "다시 시도해주세요.",
        });
      }
    } catch (error) {
      setModal({
        isOpen: true,
        message: "동아리 등록이 실패했습니다!",
        subtitle: "로그인이 필요해요",
        onConfirm: () => navigate("/login"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="club-container">
      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        subtitle={modal.subtitle}
        onConfirm={
          modal.onConfirm ||
          (() =>
            setModal({
              isOpen: false,
              message: "",
              subtitle: "",
              onConfirm: null,
            }))
        }
      />

      <div className="club-content">
        <div className="club-title">
          <img src={mainLogo} alt="mainLogo" className="club-title-logo" />
          <span>동아리 생성</span>
        </div>

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

          <div className="club-field-row">
            <CustomSelect
              label="지역"
              name="region"
              value={form.region}
              onChange={onChange}
              required={true}
              options={[
                { value: "", label: "지역 선택" },
                { value: "강원", label: "강원" },
                { value: "경기", label: "경기" },
                { value: "경남", label: "경남" },
                { value: "경북", label: "경북" },
                { value: "대전", label: "대전" },
                { value: "부산", label: "부산" },
                { value: "서울", label: "서울" },
                { value: "세종", label: "세종" },
                { value: "전남", label: "전남" },
                { value: "전북", label: "전북" },
                { value: "제주", label: "제주" },
                { value: "충남", label: "충남" },
              ]}
            />

            <CustomSelect
              label="운동 종목"
              name="sportCategory"
              value={form.sportCategory}
              onChange={onChange}
              required={true}
              options={[
                { value: "", label: "종목 선택" },
                { value: "축구", label: "축구" },
                { value: "미식축구", label: "미식축구" },
                { value: "탁구", label: "탁구" },
                { value: "농구", label: "농구" },
                { value: "티볼", label: "티볼" },
                { value: "유도", label: "유도" },
                { value: "주짓수", label: "주짓수" },
                { value: "야구", label: "야구" },
                { value: "테니스", label: "테니스" },
                { value: "러닝", label: "러닝" },
                { value: "등산", label: "등산" },
                { value: "E스포츠", label: "E스포츠" },
              ]}
            />
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
