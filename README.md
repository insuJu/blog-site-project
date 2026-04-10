# Writon

> **1인 풀스택으로 기획부터 배포까지 진행한 블로그 서비스**
>

[**배포 URL (Writon)**](https://writon.kr)  
[**GitHub Repository**](https://github.com/insuJu/blog-site-project)  
[**기술 블로그**](https://writon.kr/users/6/blog)

---

## 프로젝트 소개

직접 만든 블로그에 개발 과정을 기록하고, 기술적인 문제 해결 경험을 공유하기 위해 시작한 프로젝트.

- **개발 기간**: 2025.11 ~ 2026.01
- **개발 인원**: 1인 (기획, 디자인, 개발, 배포)

---

## 기술 스택

### Backend
| 기술 | 용도 |
|------|------|
| Java (21) | 주 언어 |
| Spring Boot (3.5.3) | 애플리케이션 프레임워크 및 REST API 서버 구축 |
| Spring Security | 인증/인가 아키텍처 및 전반적인 보안 제어 |
| Spring Data JPA | MySQL 데이터베이스 ORM 매핑 및 쿼리 처리 |
| MySQL | 메인 관계형 데이터베이스 |
| Redis | 이메일 인증 코드(TTL) 및 Refresh Token 캐싱 |
| JWT | Stateless 기반 인증 토큰 발급 및 검증 |

### Frontend
| 기술 | 용도 |
|------|------|
| React (19) | 컴포넌트 기반 사용자 인터페이스 렌더링 |
| Vite | 빠른 프론트엔드 빌드 |
| React Router | 클라이언트 사이드 라우팅 및 SPA 구현 |
| Axios | Interceptor를 활용한 API 통신 및 토큰 자동 갱신 |

### Infra
| 기술 | 용도 |
|------|------|
| Vercel | 프론트엔드 애플리케이션 호스팅 및 자동 배포 |
| Railway | 백엔드 API 서버 및 MySQL 데이터베이스 호스팅 |
| Upstash | Serverless Redis 인프라 환경 구축 |
| Cloudinary | 프로필 및 게시글 이미지 외부 CDN 스토리지 |
| Cloudflare | 도메인 DNS 관리 및 HTTPS(SSL) 적용 |
| Resend | 회원가입 및 계정 복구용 인증 이메일 발송 API |

---

## 프로젝트 구조

### Backend - 도메인 중심 패키지 구조
```text
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
```text
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

## 주요 기능 및 구현 상세

### 1. 보안 중심 인증 시스템 설계
안전하고 매끄러운 사용자 경험을 제공하기 위해 JWT 및 소셜 로그인을 통합한 인증 아키텍처 구축.
- **JWT 기반 인증**: Access Token(30분)과 Refresh Token(14일)의 만료 시간 분리. `JwtAuthenticationFilter`와 HttpOnly 쿠키 저장을 통해 XSS 공격을 방어하며, 프론트엔드에서는 Axios Interceptor를 활용하여 토큰 자동 갱신 파이프라인 구현.
- **회원가입 및 계정 복구**: 이메일 인증(6자리 코드, 5분 유효) 기능 도입. `VerificationCodeRedisRepository`를 활용해 임시 데이터를 Redis에서 관리하고, `ResendEmailSender`를 통해 환경별 이메일 발송 로직 이원화. 또한, 회원가입 완료 시 자동 로그인 및 임시 비밀번호 발급 지원.
- **OAuth2 소셜 로그인 통합**: Google 및 GitHub 소셜 로그인 지원. `CustomOAuth2UserService`를 구현하여, 동일한 이메일의 로컬 계정이 존재하면 자동으로 연동(Merge)되도록 처리해 혼합 계정을 매끄럽게 관리할 수 있도록 설계.
- **안전한 회원탈퇴**: 로컬 계정은 비밀번호와 이메일 코드를 통한 2단계 인증 적용. OAuth2 계정은 즉시 탈퇴 또는 연동 해제 가능. 데이터 무결성을 위해 Soft Delete 정책을 적용하여 7일 내 로그인 시 복구가 가능하도록 구현.

### 2. 관리자 시스템 (격리된 Admin 도메인)
효율적인 서비스 운영을 위한 전용 관리자 페이지 구축.
- **도메인 및 컴포넌트 분리**: 프론트/백엔드 모두 Admin 전용 도메인으로 격리하고, `AdminDashboardPage`, `StatCard` 등의 전용 컴포넌트를 분리하여 설계.
- **통합 관리 기능**: 방문자 통계 분석 시각화 및 회원 관리(권한 변경, 삭제), 게시글, 댓글, 카테고리, 태그 통합 관리 인터페이스 구현.
- **접근 제어**: `AdminRoute` 라우팅 가드 및 백엔드 권한 검증을 통해 `ADMIN` 권한을 가진 사용자만 접근할 수 있도록 제어.

### 3. 게시글 관리 및 자체 커스텀 에디터 구축
개발 블로그 특성에 맞게 코드 작성과 포매팅이 편리한 에디터 구현.
- **자체 커스텀 에디터 구현**: 외부 라이브러리에 전적으로 의존하지 않고 `EditorToolbar`, `CodeBlockModal`, `EditorModeSelector` 컴포넌트를 직접 설계하여 HTML과 Markdown 모드를 자유롭게 전환할 수 있도록 구현.
- **코드 하이라이팅 지원**: Prism.js를 연동하여 20개 이상의 프로그래밍 언어에 대한 코드 하이라이팅 기능 적용.
- **게시글 관리 및 메타데이터**: 게시글 CRUD 및 공개/비공개 설정 추가. 카테고리와 태그를 통한 분류 시스템을 구축하고 조회수 및 좋아요(`PostLike`) 기능 반영.

### 4. 계층형 상호작용 및 댓글 시스템
사용자 간의 원활한 소통을 위해 직관적인 댓글 시스템 구축.
- **계층형 대댓글 구현**: 무한 뎁스가 아닌 직관적인 형태의 대댓글(Reply) 구조 채택. `ReplyItem` 계층형 컴포넌트를 구현하여 댓글 및 대댓글의 CRUD 로직 완성.
- **댓글 반응 기능**: 사용자들이 서로의 의견에 공감할 수 있도록 댓글 좋아요(`CommentLike`) 처리 기능 추가.

### 5. 사용자 맞춤형 계정 및 프로필 관리
사용자가 직접 자신의 블로그 정보와 계정 보안을 관리할 수 있는 편의 기능 제공.
- **개인정보 및 보안 관리**: 현재 비밀번호 검증 절차를 거친 후 이메일 및 비밀번호를 안전하게 변경할 수 있도록 구현.
- **프로필 커스터마이징**: 블로그의 시그니처인 닉네임, 프로필 사진, 블로그명을 자유롭게 수정할 수 있도록 지원.
- **외부 CDN 연동**: `CloudinaryService`를 연동하여 프로필 이미지를 외부 클라우드 스토리지로 업로드하고 서빙함으로써 이미지 렌더링 속도를 높이고 서버 부하 최적화.

---

## 트러블슈팅 및 성능 최적화

### 1. 회원가입 폼 검증 에러 메시지 무작위 노출 문제 해결
- **문제 상황**: DTO에 설정된 여러 검증 어노테이션(`@NotBlank`, `@Size`, `@Pattern`) 동시 실패 시, 예외를 수집해 반환할 때 처리 순서가 보장되지 않아 UI에 에러 메시지가 매번 랜덤하게 노출되는 문제 발생.
- **해결 방안**: 검증 에러 종류별로 노출 우선순위(`getValidationPriority`)를 명시적으로 정의하고, 발생한 예외 리스트를 우선순위에 따라 정렬. 이후 `putIfAbsent`를 활용하여 맵에 등록함으로써 필드당 가장 중요한 첫 번째 에러 메시지만 일관되게 반환하도록 개선.

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    
    ex.getBindingResult().getFieldErrors().stream()
        .sorted(Comparator.comparingInt(this::getValidationPriority))
        .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        
    return ResponseEntity.badRequest().body(new ErrorResponse(errors));
}

private int getValidationPriority(FieldError error) {
    return switch (error.getCode()) {
        case "NotBlank" -> 1;
        case "Size" -> 2;
        case "Pattern" -> 3;
        default -> 4;
    };
}
```

### 2. JPA 준영속(Detached) 상태로 인한 업데이트 쿼리 누락 문제 해결
- **문제 상황**: 사용자 프로필 정보 수정 시, 인증 필터를 거쳐 Security Context(`AuthenticatedUser`)에 담겨있던 계정 엔티티를 그대로 수정했으나 DB에 `UPDATE` 쿼리가 누락되는 현상 발생. 트랜잭션 범위 밖에서 가져온 데이터라 '준영속' 상태로 취급되어 더티 체킹(Dirty Checking)이 동작하지 않은 것이 원인.
- **해결 방안**: `@Transactional`이 적용된 서비스 계층 내부에서 사용자 식별자(ID)를 이용해 `findById`로 DB에서 엔티티를 새롭게 다시 조회하여 '영속(Managed)' 상태로 끌어올린 후 값을 수정하도록 변경해 정상적인 업데이트 로직 구현.

```java
@Transactional
public void updateProfile(Long accountId, ProfileUpdateRequest dto) {
    Account account = accountRepository.findById(accountId)
        .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        
    account.getProfile().updateNickname(dto.getNickname());
    account.getProfile().updateBlogName(dto.getBlogName());
}
```

### 3. JWT 토큰 갱신 API와 Security Filter 간의 무한 로딩 충돌 해결
- **문제 상황**: 만료된 액세스 토큰으로 접근 시 401 에러를 감지한 프론트엔드가 `/api/auth/refresh`로 토큰 갱신을 자동 요청함. 하지만 이 재요청마저 `JwtAuthenticationFilter`를 거치면서 또다시 '만료된 토큰'으로 필터링되어, 실제 재발급 컨트롤러에 도달하지 못하고 401 에러만 반복되는 문제 발생.
- **해결 방안**: `OncePerRequestFilter`의 `shouldNotFilter` 메서드를 오버라이딩하여, 토큰 재발급 경로(`/api/auth/refresh`)나 공개 데이터 조회 경로에서는 JWT 검증 로직을 타지 않도록(Bypass) 예외를 두어 토큰 갱신 파이프라인 정상화.

```java
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    String method = request.getMethod();
    
    boolean isRefreshApi = path.equals("/api/auth/refresh");
    boolean isPublicGetApi = HttpMethod.GET.matches(method) && 
                             (path.startsWith("/api/posts") || path.startsWith("/api/comments"));
                             
    return isRefreshApi || isPublicGetApi;
}
```

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

```text
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

```text
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
