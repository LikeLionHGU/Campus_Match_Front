<div align="center">
  <img src="https://raw.githubusercontent.com/LikeLionHGU/Campus_Match_Front/main/src/assets/%EA%B8%B4%EB%A1%9C%EA%B3%A0-SB%201.png" alt="Campus Match Logo" width="300" />
  
  # 🏆 캠퍼스 매치 (Campus Match)
  
  **대학 스포츠 동아리들의 지속 가능한 교류 네트워크 플랫폼**
  <br />
</div>

<br />

## 📖 서비스 소개

**캠퍼스 매치**는 대학 스포츠 동아리들이 타 대학 동아리와 공식적으로 교류하고, 경기 및 교류의 기록을 남겨 지속 가능한 동아리 네트워크를 만드는 웹 플랫폼입니다.

---

## 🎯 기획 배경 및 문제 정의

### 🛑 기존의 문제점 (배경)

기존의 대학 스포츠 동아리 간 교류는 주로 회장단 개인의 인맥이나 에브리타임, 인스타그램 등 파편화된 SNS, 그리고 일회성 이벤트에 크게 의존하고 있었습니다.
이로 인해 다음과 같은 세 가지 주요 한계점이 발생했습니다:

1. **휘발성**: 교류가 끝난 뒤에는 승패 기록이나 활동 내역이 어디에도 남지 않음.
2. **불투명성**: 상대 동아리의 실력이나 '초크(비매너 플레이)' 여부 등 신뢰도를 사전에 파악할 수 없음.
3. **단절성**: 개인 인맥에 의존하다 보니 담당자가 바뀌면 교류 네트워크가 완전히 끊어짐.

### 💡 서비스의 전환 (해커톤 주제: '전환')

캠퍼스 매치는 동아리 단위의 공식 매칭 구조를 제공합니다. 경기 및 교류 결과를 기록하고 서로의 매너를 평가함으로써, 기존의 **'휘발되는 일회성 교류'를 '축적 가능하고 신뢰할 수 있는 지속적인 관계'로 전환**하는 것을 핵심 가치로 삼았습니다.

---

## ✨ 주요 기능 및 특징 소개

- **🔍 동아리 탐색 및 조회**: 종목/지역별 대학 스포츠 동아리 탐색 및 온도(매너 점수), 전적 확인
- **🤝 매칭 시스템**: 타 대학 동아리에 매칭을 제안하고, 받은 제안을 수락/거절하며 일정을 조율
- **📝 매치업 히스토리 (기록 관리)**: 교류 완료 후 승/무/패를 기록하고 누적 교류 데이터를 관리
- **⭐ 온도(매너 점수) 시스템**: 교류 후 상대 동아리의 매너를 상호 평가하여 배지 시스템과 연동하는 신뢰도 구축 체계
- **📸 갤러리 아카이빙**: 교류 활동 사진을 기록하여 동아리의 활발한 활동을 증명

---

## 🧗‍♂️ 핵심 개발 과정 및 트러블슈팅 (Troubleshooting)

프론트엔드 개발 과정에서 마주했던 주요 기술적 한계와, 이를 서비스 로직으로 어떻게 유연하게 풀어나갔는지에 대한 기록입니다.

### 1. 비동기 알림(Notification) 데이터의 동기화 및 구조화 문제

- **상황**: 백엔드 API에서 `/noti/default`는 전체 알림을 배열로 보내주고, 특정 탭(`/noti/send`)은 빈 배열을 반환하는 등 응답 구조(Data Structure)에 일관성이 없었으며, 알림 종류(`notiType`)에 따라 누락되는 필드(`awayClubId` 등)가 존재했습니다.
- **해결**: 프론트엔드(`NotificationModal.js`)에서 API 응답을 가로채어 데이터 구조를 방어적으로 파싱(Defensive Parsing)하도록 설계했습니다. `Array.isArray()`와 옵셔널 체이닝 연산자를 사용하여 데이터 형태에 맞춰 배열을 단일화하고, `switch` 문을 활용해 `notiType`별로 렌더링할 텍스트와 라우팅 로직을 독립적으로 분리하여 무결성을 확보했습니다.

### 2. Dashboard 배지(Badge) 렌더링과 이미지 포맷 예외 처리

- **상황**: 획득한 배지를 대시보드에 프로필 형태로 렌더링해야 했으나, API에서 S3 내부 경로(`s3://...`)를 반환하여 브라우저에서 `ERR_UNKNOWN_URL_SCHEME` 에러가 발생했습니다.
- **해결**: 브라우저 렌더링 한계를 파악하고, 백엔드와 소통하여 퍼블릭 `https://` URL 포맷으로의 전환을 확정한 후, 프론트엔드에서는 `Math.max()`와 빈 배열 삽입(Array Filler) 기법을 활용하여 최대 6개의 배지 슬롯(가상 슬롯)을 고정적으로 보여주는 우아한 형태의 UI를 구축해두고 API 응답을 동적으로 매핑했습니다.

### 3. API CORS 이슈 및 Preflight Request 거부 문제

- **상황**: `axios` 또는 `fetch`를 활용한 회원가입 폼 전송 시 브라우저에서 CORS 정책 위반 에러가 지속적으로 발생했습니다.
- **해결**: 복합 페이로드(`multipart/form-data` 내부에 JSON Blob과 File을 함께 전송) 상황에서 브라우저가 자동으로 생성하는 Boundary 헤더를 덮어쓰고 있다는 사실을 간파했습니다. 수동으로 지정했던 `Content-Type` 헤더를 삭제하여 브라우저가 올바른 멀티파트 폼 데이터 Boundary를 형성하도록 수정하여 CORS 이슈를 우회하고 서버가 데이터를 온전히 읽을 수 있도록 조치했습니다.

### 4. Figma 디자인 시스템의 픽셀 퍼펙트(Pixel Perfect) 모달 구현

- **상황**: 복잡한 입력창(갤러리 업로드 등)에 네이티브 캘린더 피커(`input[type="date"]`)를 적용했을 때 기본 브라우저 스타일이 디자인을 해치는 문제가 있었습니다.
- **해결**: 네이티브 DatePicker의 편리한 기능은 유지하되, CSS의 `::-webkit-datetime-edit` 가상 선택자와 `:required:invalid` 상태를 활용한 트릭을 적용했습니다. 입력값이 없을 때는 투명하게 만들고 가짜 Placeholder 자식 요소를 띄워 **"연도. 월. 일."** 이라는 일관된 디자인 시스템 텍스트를 노출시켰으며, 달력 아이콘만 살려 모달 UI의 심미성을 극대화했습니다.

---

## 🌟 기대 효과

1. **공정성 보장**: 개인 인맥에 의존하지 않는 누구나 접근 가능한 공정한 교류 시스템 형성
2. **사전 검증된 신뢰도**: 동아리 간 온도(매너 점수)와 뱃지, 히스토리를 기반으로 신뢰할 수 있는 매칭
3. **지속 가능한 아카이빙**: 단발성 만남의 증발을 막고, 스포츠 동아리의 '가치'가 누적되는 네트워킹 구축

---

## 🛠 기술 스택

### Frontend

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />

### Backend (협업 환경)

<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" /> <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />

### Deployment

<img src="https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" />
