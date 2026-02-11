import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import mainLogo from "../../assets/mainLogo.png";
import editIcon from "../../assets/Edit.svg";

export default function MyPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clubId, setClubId] = useState(null);

  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    subtitle: "",
    onConfirm: null,
    showCancel: false,
  });

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    university: "",
    clubName: "",
    phone1: "",
    phone2: "",
    phone3: "",
  });

  // const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const openModal = (
    message,
    onConfirm = null,
    showCancel = false,
    subtitle = "",
  ) => {
    setModal({
      isOpen: true,
      message,
      subtitle,
      onConfirm,
      showCancel,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      message: "",
      subtitle: "",
      onConfirm: null,
      showCancel: false,
    });
  };

  const handleModalConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    closeModal();
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedClubId = localStorage.getItem("clubId");
        if (!storedClubId) {
          openModal("로그인이 필요합니다.", () => navigate("/login"));
          return;
        }
        setClubId(storedClubId);

        const response = await fetch(
          `${process.env.REACT_APP_HOST_URL}/api/club/setting/${storedClubId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          },
        );

        const data = await response.json();
        console.log("내 정보 조회 성공:", data);

        setForm({
          username: data.username || "",
          password: "",
          name: data.name || "",
          email: data.email || "",
          university: data.university || "",
          clubName: data.clubName || "",
        });
      } catch (error) {
        console.error("내 정보 조회 실패:", error);
        openModal(`정보를 불러오는데 실패했습니다: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // if (!clubId) {
    //   openModal("로그인이 필요합니다.", () => navigate("/login"));
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const updateData = {
        name: form.name,
        username: form.username,
        password: form.password,
        university: form.university,
        clubName: form.clubName,
        email: form.email,
      };

      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/club/setting/${clubId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "정보 수정에 실패했습니다.");
      }

      openModal("수정되었습니다");
    } catch (error) {
      openModal("정보 수정에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeUnregister = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/club/setting/${clubId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원 탈퇴에 실패했습니다.");
      }

      localStorage.removeItem("clubId");
      localStorage.removeItem("userInfo");

      openModal(
        "탈퇴가 완료되었습니다",
        () => navigate("/"),
        false,
        "지금까지 이용해 주셔서 감사합니다",
      );
    } catch (error) {
      openModal(`회원 탈퇴에 실패했습니다: ${error.message}`);
    }
  };

  const onUnregister = () => {
    openModal("정말 캠퍼스 매치를 탈퇴 하시겠습니까?", executeUnregister, true);
  };

  const onSearchUniversity = () => {
    // TODO: 대학 검색 모달 구현
  };

  const onSearchClub = () => {
    // TODO: 동아리 검색 모달 구현
  };

  const isFormValid =
    form.username &&
    form.name &&
    form.email &&
    form.university &&
    form.clubName;

  if (isLoading) {
    return (
      <div className="mypage-container">
        <div className="mypage-content">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-message">{modal.message}</p>
            {modal.subtitle && (
              <p className="modal-subtitle">{modal.subtitle}</p>
            )}
            <div className="modal-buttons">
              {modal.showCancel && (
                <button className="modal-btn cancel" onClick={closeModal}>
                  취소
                </button>
              )}
              <button
                className="modal-btn confirm"
                onClick={handleModalConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mypage-content">
        <div className="mypage-header"></div>

        <div className="mypage-body">
          <div className="profile-section">
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
              <label htmlFor="profile-upload" className="edit-icon-btn">
                <img
                  src={editIcon}
                  alt="프로필 편집"
                  className="profile-edit-icon"
                />
              </label>
              <input
                type="file"
                id="profile-upload"
                className="profile-upload-input"
                accept="image/*"
                onChange={onImageChange}
              />
            </div>
          </div>
          <div className="title">내 정보</div>
        </div>

        <div className="divider" />

        <form className="mypage-form" onSubmit={onSubmit}>
          <div className="formGrid">
            <div className="col">
              <Field label="아이디" required>
                <input
                  name="username"
                  value={form.username}
                  onChange={onChange}
                />
              </Field>

              <Field label="비밀번호" required>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                />
              </Field>

              <Field label="이름" required>
                <input name="name" value={form.name} onChange={onChange} />
              </Field>
            </div>

            <div className="col">
              <Field label="이메일" required>
                <input name="email" value={form.email} onChange={onChange} />
              </Field>

              <Field label="대학" required noControl>
                <div className="inputWithButton">
                  <input
                    name="university"
                    value={form.university}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="searchBtn"
                    onClick={onSearchUniversity}
                  >
                    찾기
                  </button>
                </div>
              </Field>

              <Field label="동아리" required noControl>
                <div className="inputWithButton">
                  <input
                    name="clubName"
                    value={form.clubName}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="searchBtn"
                    onClick={onSearchClub}
                  >
                    찾기
                  </button>
                </div>
              </Field>
            </div>
          </div>

          <div className="phoneSection">
            <Field label="전화번호" required noControl>
              <div className="phoneRow">
                <input
                  className="phone"
                  name="phone1"
                  value={form.phone1}
                  onChange={onChange}
                  maxLength={3}
                />
                <span className="dash"></span>
                <input
                  className="phone"
                  name="phone2"
                  value={form.phone2}
                  onChange={onChange}
                  maxLength={4}
                />
                <span className="dash"></span>
                <input
                  className="phone"
                  name="phone3"
                  value={form.phone3}
                  onChange={onChange}
                  maxLength={4}
                />
              </div>
            </Field>
          </div>

          <div className="buttonRow">
            <button
              type="button"
              className="unregisterBtn"
              onClick={onUnregister}
            >
              회원 탈퇴
            </button>
            <button
              className={`submitBtn ${isFormValid ? "active" : ""}`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "수정 중..." : "수정하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, required = false, noControl = false }) {
  return (
    <div className="field">
      <div className="label">
        {label}
        {required && <span className="required">*</span>}
      </div>
      {noControl ? children : <div className="control">{children}</div>}
    </div>
  );
}
