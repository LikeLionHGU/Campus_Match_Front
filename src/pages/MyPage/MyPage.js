import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import mainLogo from "../../assets/mainLogo.png";
import editIcon from "../../assets/Edit.svg";
import Modal from "../../components/Modal/Modal";

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

  const [profileImage, setProfileImage] = useState(null);
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

  const toAbsoluteUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${process.env.REACT_APP_HOST_URL}${url}`;
  };

  const fetchUserInfo = async (id) => {
    const response = await fetch(
      `${process.env.REACT_APP_HOST_URL}/api/club/setting/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: localStorage.getItem("Authorization"),
        },
      },
    );

    if (!response.ok) throw new Error("정보를 불러오는데 실패했습니다.");

    const data = await response.json();

    let p1 = "";
    let p2 = "";
    let p3 = "";

    if (data.phone) {
      if (data.phone.includes("-")) {
        const parts = data.phone.split("-");
        if (parts.length === 3) {
          p1 = parts[0];
          p2 = parts[1];
          p3 = parts[2];
        }
      } else if (data.phone.length === 11) {
        p1 = data.phone.substring(0, 3);
        p2 = data.phone.substring(3, 7);
        p3 = data.phone.substring(7, 11);
      } else if (data.phone.length === 10) {
        p1 = data.phone.substring(0, 3);
        p2 = data.phone.substring(3, 6);
        p3 = data.phone.substring(6, 10);
      }
    }

    const imageFromData = toAbsoluteUrl(data.imageUrl);
    if (imageFromData) setPreviewUrl(imageFromData);

    setForm({
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email,
      university: data.university,
      clubName: data.clubName,
      phone1: p1,
      phone2: p2,
      phone3: p3,
    });
  };

  useEffect(() => {
    const storedClubId = localStorage.getItem("clubId");

    (async () => {
      try {
        let currentClubId = storedClubId;

        if (!currentClubId) {
          const infoRes = await fetch(
            `${process.env.REACT_APP_HOST_URL}/api/club/info`,
            {
              method: "GET",
              headers: {
                Authorization: localStorage.getItem("Authorization"),
                "Content-Type": "application/json",
              },
            },
          );
          if (infoRes.ok) {
            const infoData = await infoRes.json();
            currentClubId = infoData.clubId;
            if (currentClubId) {
              localStorage.setItem("clubId", currentClubId);
            }
          }
        }

        if (currentClubId) {
          setClubId(currentClubId);
          await fetchUserInfo(currentClubId);
        } else {
          throw new Error("Club ID not found");
        }
      } catch (error) {
        openModal("정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    form.username &&
    form.name &&
    form.email &&
    form.university &&
    form.clubName;

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const phoneCombined = `${form.phone1}-${form.phone2}-${form.phone3}`;

      const updateData = {
        name: form.name,
        username: form.username,
        university: form.university,
        clubName: form.clubName,
        email: form.email,
        phone: phoneCombined,
      };

      if (form.password) updateData.password = form.password;

      const formData = new FormData();
      const requestBlob = new Blob([JSON.stringify(updateData)], {
        type: "application/json",
      });

      formData.append("request", requestBlob, "request.json");

      if (profileImage) {
        formData.append("image", profileImage);
      }

      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/club/setting/${clubId}`,
        {
          method: "PUT",
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`정보 수정 실패: ${response.status}`);
      }

      await response.json();

      setProfileImage(null);
      await fetchUserInfo(clubId);

      openModal("수정되었습니다", closeModal);
    } catch (error) {
      openModal("정보 수정에 실패했습니다", closeModal);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMem = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/club/setting`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: localStorage.getItem("Authorization"),
          },
        },
      );

      if (!response.ok) {
        throw new Error(`회원 탈퇴에 실패했습니다: ${response.status}`);
      }

      localStorage.removeItem("Authorization");
      localStorage.removeItem("RefreshToken");
      localStorage.removeItem("clubId");
      localStorage.removeItem("userInfo");

      openModal(
        "탈퇴가 완료되었습니다",
        () => navigate("/login"),
        false,
        "지금까지 이용해 주셔서 감사합니다",
      );
    } catch (error) {
      openModal(error.message || "회원 탈퇴에 실패했습니다.");
    }
  };

  const onDelete = () => {
    openModal("정말 캠퍼스 매치를 탈퇴 하시겠습니까?", deleteMem, true);
  };

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
      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        subtitle={modal.subtitle}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
        showCancel={modal.showCancel}
      />

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
                  value={""}
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

              <Field label="대학" required>
                <input
                  name="university"
                  value={form.university}
                  onChange={onChange}
                />
              </Field>

              <Field label="동아리" required>
                <input
                  name="clubName"
                  value={form.clubName}
                  onChange={onChange}
                />
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
            <button type="button" className="unregisterBtn" onClick={onDelete}>
              회원 탈퇴
            </button>
            <button
              className={`submitBtn ${isFormValid ? "active" : ""}`}
              type="submit"
              disabled={!isFormValid || isSubmitting}
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
