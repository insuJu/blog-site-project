# Blog Site Project

> 1인 풀스택으로 기획부터 배포까지 진행한 개인 블로그 서비스

[**배포 URL (Writon)**](https://writon.kr)  
[**GitHub Repository**](https://github.com/insuJu/blog-site-project)  
[**기술 블로그**](https://writon.kr/users/6/blog)

---

## 프로젝트 소개

직접 만든 블로그에 개발 과정을 기록하고, 기술적인 문제 해결 경험을 공유하기 위해 시작한 프로젝트입니다.

- **개발 기간**: 2025.11 ~ (진행 중)
- **개발 인원**: 1인 (기획, 디자인, 개발, 배포)

---

## 기술 스택

### Backend
| 기술 | 버전 |
|------|------|
| Java | 21 |
| Spring Boot | 3.5.3 |
| Spring Security | |
| Spring Data JPA | |
| MySQL | 8.x |
| Redis | |
| JWT (jjwt) | 0.11.5 |

### Frontend
| 기술 | 버전 |
|------|------|
| React | 19.1.0 |
| Vite | 7.2.4 |
| React Router | 6.23.0 |
| Axios | 1.6.8 |

### Infra
| 기술 | 용도 |
|------|------|
| Vercel | Frontend |
| Railway | Backend, MySQL |
| Upstash | Redis |
| Cloudinary | 이미지 CDN |
| Cloudflare | DNS, SSL |
| Resend | 이메일 발송 |

---

## 프로젝트 구조

### Backend - 도메인 중심 패키지 구조
```
backend/src/main/java/com/project/blog/
├── domain/
│   ├── account/        # 계정
│   ├── admin/          # 관리자
│   ├── profile/        # 프로필
│   ├── post/           # 게시글
│   ├── comment/        # 댓글
│   ├── category/       # 카테고리
│   ├── tag/            # 태그
│   ├── like/           # 좋아요
│   └── stat/           # 통계
└── global/
    ├── security/       # JWT, OAuth2, 인증 필터
    ├── verification/   # 이메일 인증 (Redis)
    ├── mail/           # 메일 발송
    ├── file/           # 파일 업로드
    ├── error/          # 예외 처리
    └── config/         # 설정
```

### Frontend - Feature 기반 구조
```
frontend/src/
├── features/
│   ├── auth/           # 인증 (로그인, 회원가입, OAuth2)
│   ├── admin/          # 관리자
│   ├── post/           # 게시글
│   ├── comment/        # 댓글
│   ├── category/       # 카테고리
│   ├── tag/            # 태그
│   ├── settings/       # 설정
│   └── like/           # 좋아요
├── components/         # 공통 컴포넌트
├── contexts/           # 전역 상태
├── routes/             # 라우팅
└── api/                # API 클라이언트
```

---

## 주요 기능

### 인증/인가
- **JWT 기반 인증**
  - Access Token (30분) + Refresh Token (14일)
  - HttpOnly 쿠키 저장 (XSS 방어)
  - Axios Interceptor 자동 갱신

- **회원가입**
  - 이메일 인증 (6자리 코드, 5분 유효)
  - 회원가입 후 자동 로그인

- **OAuth2 소셜 로그인**
  - Google, GitHub 지원
  - 동일 이메일 로컬 계정 자동 연동
  - OAuth2 전용 / 로컬+OAuth2 혼합 계정 지원

- **계정 찾기 및 복구**
  - 아이디 찾기 (이메일로 아이디 발송)
  - 비밀번호 재설정 (인증 코드 → 임시 비밀번호 발급)

- **회원탈퇴**
  - 로컬 계정: 2단계 인증 (비밀번호 + 이메일 코드)
  - OAuth2 계정: 즉시 탈퇴 또는 연동 해제
  - Soft Delete (7일 내 로그인 시 복구 가능)

### 계정 관리
- 이메일 변경 (비밀번호 검증)
- 비밀번호 변경

### 관리자
- 대시보드 통계
- 회원 관리 (권한 변경, 삭제)
- 게시글/댓글/카테고리/태그 관리
- ADMIN 권한 기반 접근 제어

### 게시글
- 게시글 CRUD
- HTML / Markdown 에디터 지원
- Prism.js 코드 하이라이팅 (20+ 언어)
- 카테고리 & 태그 분류
- 조회수, 좋아요
- 공개/비공개 설정

### 댓글
- 댓글 & 대댓글 CRUD
- 댓글 좋아요

### 프로필
- 닉네임, 블로그명 수정
- 프로필 이미지 업로드

---

## 설계 결정

### JWT를 쿠키에 저장한 이유

| 방식 | 설명 | 단점 |
|------|------|------|
| 헤더 (Authorization) | 프론트에서 토큰 저장 후 요청마다 헤더에 추가 | JS에서 토큰 접근 가능 → XSS 취약 |
| HttpOnly 쿠키 | 서버가 쿠키로 전송, 브라우저가 자동 포함 | JS로 접근 불가 → XSS 방어 |

**선택 이유**:
- `HttpOnly` 옵션으로 JavaScript 접근 차단 → XSS 방어
- `SameSite`, `Secure` 옵션으로 로컬/배포 환경별 세밀한 제어 가능
- 요청마다 수동으로 헤더에 토큰을 추가할 필요 없음 (자동 전송)

### Account / Profile 엔티티 분리

| Account (보안 민감) | Profile (서비스 표시용) |
|---------------------|------------------------|
| email, username, password | nickname, blogName, avatar |
| 인증/인가에 직접 사용 | 화면 표시용 데이터 |
| 변경 시 보안 검증 필요 | 자유롭게 수정 가능 |

**선택 이유**: 보안 레벨이 다른 데이터를 분리하여 관리

### Access Token / Refresh Token 분리

| Token | 용도 | 만료 시간 |
|-------|------|----------|
| Access Token | API 인증 | 짧음 (30분) |
| Refresh Token | Access Token 재발급 | 길음 (14일) |

**선택 이유**:
- Access Token 탈취 시 피해 최소화 (짧은 만료)
- Refresh Token으로 사용자 경험 유지 (자동 갱신)

### 이메일 인증 코드 - Redis 저장

```
Key: verification:{email}:{type}
Value: 6자리 숫자 코드
TTL: 5분 (자동 만료)
```

| Type | 용도 |
|------|------|
| EMAIL_SIGNUP | 회원가입 |
| PASSWORD_RESET | 비밀번호 재설정 |
| ACCOUNT_DELETION | 회원탈퇴 |

**선택 이유**:
- TTL 자동 만료 (DB 정리 불필요)
- 빠른 조회 (대량 트래픽 대응)
- 일회용 코드 (검증 후 즉시 삭제)

### 회원탈퇴 - Soft Delete

```
ACTIVE (정상) → DEACTIVATED (비활성화)
```

**선택 이유**:
- 데이터 무결성 유지 (게시글, 댓글 등 참조 관계)
- 7일 내 로그인 시 계정 복구 가능
- 통계 및 히스토리 보존

### OAuth2 계정 병합 전략

| 시나리오 | 처리 |
|----------|------|
| 로컬 계정 → OAuth2 로그인 | 동일 이메일이면 자동 연동 |
| OAuth2 계정 → 로컬 회원가입 | username/password 추가 연동 |
| 혼합 계정 → OAuth2 해제 | OAuth2 정보만 제거, 로컬 유지 |
| OAuth2 전용 → 탈퇴 | 즉시 삭제 (비밀번호 없음) |
| 혼합 계정 → 탈퇴 | 2단계 인증 (비밀번호 + 이메일 코드) |

**선택 이유**:
- 사용자가 하나의 이메일로 여러 로그인 방식 사용 가능
- OAuth2 전용 계정도 나중에 로컬 로그인 추가 가능
- 연동 해제 시에도 기존 데이터 유지

### 환경별 메일 발송 분리

| 환경 | 방식 | 이유 |
|------|------|------|
| dev | Gmail SMTP | 빠른 테스트, 무료 |
| prod | Resend API | 안정성, 전달률 향상 |

---

## 트러블슈팅

개발 중 마주친 문제들과 해결 과정입니다.

| 문제 | 원인 | 해결 |
|------|------|------|
| Profile 수정 시 UPDATE 쿼리 미실행 | 인증 필터에서 조회한 엔티티가 준영속 상태 | Service에서 `findById()`로 다시 조회하여 영속 상태로 변경 |
| 토큰 갱신 요청에서 401 | JWT 필터가 `/api/auth/refresh`까지 검증 | `shouldNotFilter()`로 해당 경로 필터 제외 |
| 검증 에러 메시지가 매번 랜덤 | `getFieldErrors()` 순서 미보장 + `put()` 덮어쓰기 | 우선순위 정렬 + `putIfAbsent()` |
| @MapsId에서 INSERT가 UPDATE로 실행 | PK 직접 세팅 → JPA가 Detached 엔티티로 판단 | builder에서 `accountId` 제거, `account`만 세팅 |

자세한 내용은 [기술 블로그](https://is-bono.tistory.com)에 정리했습니다.

---

## 테스트

Service 계층 단위 테스트 (JUnit5 + Mockito)

- `AccountServiceTest`
- `AuthServiceTest`
- `RefreshTokenServiceTest`
- `ProfileServiceTest`

---

## 실행 방법

### Backend
```bash
cd backend
./gradlew bootRun
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 환경 변수 (예시)

#### 공통 (application.properties)
```properties
spring.profiles.active=dev  # 또는 prod

# JWT
jwt.access.expiration.seconds=1800      # 30분
jwt.refresh.expiration.seconds=1209600  # 14일
```

#### 개발 환경 (application-dev.properties)
```properties
# 서버
server.port=8080
app.cors.allowed-origins=http://localhost:3000

# 쿠키 설정
app.cookie.same-site=Strict
app.cookie.secure=false

# 데이터베이스
spring.datasource.url=jdbc:mysql://localhost:3306/blog
spring.datasource.username=your-username
spring.datasource.password=your-password

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# JWT
jwt.secret.key=your-base64-encoded-secret-key

# 파일 업로드
file.upload-dir=D:/your/upload/path
file.base-url=http://localhost:8080

# 메일 (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
app.mail.from=your-email@gmail.com

# OAuth2
spring.security.oauth2.client.registration.github.client-id=your-github-client-id
spring.security.oauth2.client.registration.github.client-secret=your-github-client-secret
spring.security.oauth2.client.registration.google.client-id=your-google-client-id
spring.security.oauth2.client.registration.google.client-secret=your-google-client-secret
app.oauth2.redirect-uri=http://localhost:3000/oauth2/redirect
```

#### 운영 환경 (application-prod.properties)
```properties
# CORS & 쿠키
app.cors.allowed-origins=${FRONTEND_URL}
app.cookie.same-site=None
app.cookie.secure=true

# 데이터베이스
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}

# Redis
spring.data.redis.host=${REDIS_HOST}
spring.data.redis.port=${REDIS_PORT}
spring.data.redis.password=${REDIS_PASSWORD}
spring.data.redis.ssl.enabled=true

# JWT
jwt.secret.key=${JWT_SECRET_KEY}

# Cloudinary (이미지 업로드)
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}

# 메일 (Resend API)
resend.api-key=${RESEND_API_KEY}
app.mail.from=${APP_MAIL_FROM}

# OAuth2
spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
app.oauth2.redirect-uri=${FRONTEND_URL}/oauth2/redirect
```