# 🔐 Ainus 사용자 인증 시스템 기획서

## 📱 목차

1. [개요](#1-개요)
2. [인증 방식](#2-인증-방식)
3. [화면 설계](#3-화면-설계)
4. [사용자 플로우](#4-사용자-플로우)
5. [기술 구현](#5-기술-구현)
6. [보안 정책](#6-보안-정책)
7. [에러 처리](#7-에러-처리)
8. [API 명세](#8-api-명세)

---

## 1. 개요

### 1.1 목적

Ainus 애플리케이션의 사용자 인증 시스템을 구축하여 안전하고 편리한 회원 가입 및 로그인 경험을 제공합니다.

### 1.2 지원 인증 방식

| 인증 방식 | 설명 | 우선순위 |
|---------|------|---------|
| **이메일 + 비밀번호** | 기본 회원가입 방식 | 1순위 |
| **Google 소셜 로그인** | Google OAuth 2.0 | 1순위 |
| **Kakao 소셜 로그인** | Kakao OAuth 2.0 | 1순위 |
| **자동 로그인** | JWT Refresh Token | 2순위 |

### 1.3 핵심 요구사항

✅ **보안**
- 비밀번호 bcrypt 해싱 (Salt rounds: 10)
- JWT 토큰 기반 인증 (Access Token 15분, Refresh Token 7일)
- HTTPS 통신 필수

✅ **사용자 경험**
- 간편한 소셜 로그인
- 자동 로그인 지원
- 직관적인 UI/UX
- 빠른 응답 속도 (< 2초)

✅ **기능**
- 이메일 중복 확인
- 비밀번호 강도 검증
- 비밀번호 찾기 (이메일 인증)
- 프로필 설정 연동

---

## 2. 인증 방식

### 2.1 이메일 회원가입

#### **입력 필드**

```
필수 항목:
- 이메일 (example@domain.com)
- 비밀번호 (8-72자)
- 비밀번호 확인
- 닉네임 (2-50자)

선택 항목:
- 마케팅 수신 동의
```

#### **비밀번호 요구사항**

```
✅ 최소 8자, 최대 72자
✅ 영문 소문자 포함
✅ 영문 대문자 포함
✅ 숫자 포함
✅ 특수문자 포함 (!@#$%^&*()_+-=[]{}|;:,.<>?)

예시:
✅ "SecurePass123!" (유효)
❌ "password" (대문자, 숫자, 특수문자 없음)
❌ "Pass1!" (8자 미만)
```

#### **이메일 유효성 검증**

```javascript
// 이메일 형식 검증 정규식
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 검증 예시
"user@example.com" ✅ 유효
"user.name+tag@example.co.kr" ✅ 유효
"user@" ❌ 무효 (도메인 없음)
"@example.com" ❌ 무효 (로컬 파트 없음)
"user space@example.com" ❌ 무효 (공백 포함)
```

### 2.2 소셜 로그인

#### **Google OAuth 2.0 흐름**

```
1. 사용자 → [Google로 계속하기] 버튼 클릭
   ↓
2. Google 로그인 페이지로 리다이렉트
   ↓
3. 사용자 Google 계정으로 로그인
   ↓
4. 권한 동의 (이메일, 프로필 정보)
   ↓
5. Authorization Code 받음
   ↓
6. 서버 → Google에 Access Token 요청
   ↓
7. Google → 사용자 프로필 정보 반환
   ↓
8. 서버 → 사용자 조회/생성
   ↓
9. JWT 토큰 발급
   ↓
10. 앱으로 리다이렉트 (자동 로그인)
```

#### **Kakao OAuth 2.0 흐름**

```
1. 사용자 → [카카오로 계속하기] 버튼 클릭
   ↓
2. 카카오 로그인 페이지로 리다이렉트
   ↓
3. 사용자 카카오 계정으로 로그인
   ↓
4. 권한 동의 (프로필, 이메일)
   ↓
5. Authorization Code 받음
   ↓
6. 서버 → 카카오에 Access Token 요청
   ↓
7. 카카오 → 사용자 프로필 정보 반환
   ↓
8. 서버 → 사용자 조회/생성
   ↓
9. JWT 토큰 발급
   ↓
10. 앱으로 리다이렉트 (자동 로그인)
```

#### **소셜 계정 연동 정보**

```typescript
interface SocialAccount {
  user_id: string;           // Ainus 사용자 ID
  provider: 'google' | 'kakao';
  provider_user_id: string;  // 소셜 플랫폼의 사용자 ID
  email: string;
  access_token: string;      // 암호화 저장
  refresh_token?: string;    // 암호화 저장
  connected_at: Date;
  last_login: Date;
}
```

### 2.3 JWT 토큰 관리

#### **토큰 종류**

| 토큰 | 유효기간 | 용도 | 저장 위치 |
|-----|---------|------|----------|
| **Access Token** | 15분 | API 요청 인증 | 메모리 (변수) |
| **Refresh Token** | 7일 | Access Token 갱신 | HttpOnly Cookie 또는 Secure Storage |

#### **JWT Payload 구조**

```typescript
interface JWTPayload {
  user_id: string;
  email: string;
  nickname: string;
  auth_provider: 'email' | 'google' | 'kakao';
  iat: number;  // 발급 시간
  exp: number;  // 만료 시간
}

// 예시
{
  "user_id": "uuid-v4-string",
  "email": "user@example.com",
  "nickname": "최수안",
  "auth_provider": "email",
  "iat": 1704450000,
  "exp": 1704450900
}
```

#### **토큰 갱신 플로우**

```
1. Access Token 만료 (15분 경과)
   ↓
2. API 요청 시 401 Unauthorized 응답
   ↓
3. 클라이언트 → POST /api/auth/refresh
   Headers: { Refresh-Token: "eyJhbGc..." }
   ↓
4. 서버 → Refresh Token 검증
   ↓
5. 유효하면 → 새로운 Access Token 발급
   ↓
6. 클라이언트 → 토큰 저장 후 재요청
```

---

## 3. 화면 설계

### 3.1 스플래시 화면

```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│                                      │
│           [Ainus 로고]               │
│                                      │
│        AI + In + Us                  │
│                                      │
│                                      │
│       자동 로그인 확인 중...         │
│                                      │
│                                      │
│                                      │
└──────────────────────────────────────┘

로직:
1. 저장된 Refresh Token 확인
2. 있으면 → 토큰 검증 → 홈 화면
3. 없으면 → 로그인 화면
```

### 3.2 로그인 선택 화면

```
┌──────────────────────────────────────┐
│                                      │
│           [Ainus 로고]               │
│                                      │
│        AI 시대 네비게이터            │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  🔐 간편하게 시작하기                │
│                                      │
│  ┌────────────────────────────────┐│
│  │ 🔵 Google로 계속하기           ││
│  └────────────────────────────────┘│
│                                      │
│  ┌────────────────────────────────┐│
│  │ 🟡 카카오로 계속하기           ││
│  └────────────────────────────────┘│
│                                      │
│ ────────────────────────────────────│
│                                      │
│  또는 이메일로 로그인                │
│                                      │
│  ┌────────────────────────────────┐│
│  │ 📧 이메일로 계속하기           ││
│  └────────────────────────────────┘│
│                                      │
│ ────────────────────────────────────│
│                                      │
│       아직 계정이 없으신가요?        │
│       [회원가입]                     │
│                                      │
└──────────────────────────────────────┘
```

### 3.3 이메일 회원가입 화면

```
┌──────────────────────────────────────┐
│ [←] 회원가입                         │  ← 헤더
├──────────────────────────────────────┤
│                                      │
│  환영합니다! 👋                      │
│  Ainus와 함께 AI 시대를 준비하세요  │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  이메일 *                            │
│  ┌────────────────────────────────┐│
│  │ example@domain.com             ││
│  └────────────────────────────────┘│
│  ✅ 사용 가능한 이메일입니다         │
│                                      │
│  비밀번호 *                          │
│  ┌────────────────────────────────┐│
│  │ ••••••••••                     ││  [👁️]
│  └────────────────────────────────┘│
│                                      │
│  비밀번호 강도:                      │
│  ●●●○○ 보통                        │
│                                      │
│  ✅ 8자 이상                         │
│  ✅ 대문자 포함                      │
│  ✅ 소문자 포함                      │
│  ✅ 숫자 포함                        │
│  ❌ 특수문자 포함                    │
│                                      │
│  비밀번호 확인 *                     │
│  ┌────────────────────────────────┐│
│  │ ••••••••••                     ││  [👁️]
│  └────────────────────────────────┘│
│  ✅ 비밀번호가 일치합니다            │
│                                      │
│  닉네임 *                            │
│  ┌────────────────────────────────┐│
│  │ 최수안                         ││
│  └────────────────────────────────┘│
│  2-50자 이내                         │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  [ ] 서비스 이용약관 동의 (필수)    │
│  [ ] 개인정보 처리방침 동의 (필수)  │
│  [ ] 마케팅 정보 수신 동의 (선택)   │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  ┌────────────────────────────────┐│
│  │     회원가입 완료하기          ││  ← 비활성(회색) → 활성(파랑)
│  └────────────────────────────────┘│
│                                      │
│       이미 계정이 있으신가요?        │
│       [로그인]                       │
│                                      │
└──────────────────────────────────────┘
```

### 3.4 이메일 로그인 화면

```
┌──────────────────────────────────────┐
│ [←] 로그인                           │  ← 헤더
├──────────────────────────────────────┤
│                                      │
│  다시 만나서 반가워요! 👋            │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  이메일                              │
│  ┌────────────────────────────────┐│
│  │ example@domain.com             ││
│  └────────────────────────────────┘│
│                                      │
│  비밀번호                            │
│  ┌────────────────────────────────┐│
│  │ ••••••••••                     ││  [👁️]
│  └────────────────────────────────┘│
│                                      │
│  [✓] 자동 로그인                    │
│                                      │
│  [비밀번호를 잊으셨나요?]           │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  ┌────────────────────────────────┐│
│  │        로그인하기              ││
│  └────────────────────────────────┘│
│                                      │
│ ────────────────────────────────────│
│                                      │
│  또는 다음으로 로그인:               │
│                                      │
│  [🔵 Google] [🟡 Kakao]             │
│                                      │
│ ────────────────────────────────────│
│                                      │
│       아직 계정이 없으신가요?        │
│       [회원가입]                     │
│                                      │
└──────────────────────────────────────┘
```

### 3.5 비밀번호 찾기 화면 (1단계: 이메일 입력)

```
┌──────────────────────────────────────┐
│ [←] 비밀번호 찾기                    │  ← 헤더
├──────────────────────────────────────┤
│                                      │
│  🔑 비밀번호를 재설정합니다          │
│                                      │
│  가입 시 사용한 이메일 주소를        │
│  입력해주세요.                       │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  이메일                              │
│  ┌────────────────────────────────┐│
│  │ example@domain.com             ││
│  └────────────────────────────────┘│
│                                      │
│  입력하신 이메일로 비밀번호 재설정  │
│  링크를 보내드립니다.                │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  ┌────────────────────────────────┐│
│  │     재설정 링크 보내기         ││
│  └────────────────────────────────┘│
│                                      │
│       [로그인 화면으로 돌아가기]     │
│                                      │
└──────────────────────────────────────┘
```

### 3.6 비밀번호 찾기 화면 (2단계: 이메일 전송 완료)

```
┌──────────────────────────────────────┐
│ [←] 비밀번호 찾기                    │
├──────────────────────────────────────┤
│                                      │
│  ✅ 이메일을 보냈습니다!             │
│                                      │
│  [이메일 아이콘]                     │
│                                      │
│  example@domain.com 으로             │
│  비밀번호 재설정 링크를 보냈습니다. │
│                                      │
│  이메일을 확인하고 링크를 클릭하여  │
│  비밀번호를 재설정해주세요.          │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  💡 이메일이 오지 않았나요?         │
│                                      │
│  • 스팸 메일함을 확인해주세요       │
│  • 이메일 주소를 정확히 입력했는지  │
│    확인해주세요                      │
│                                      │
│  ┌────────────────────────────────┐│
│  │     이메일 다시 보내기         ││
│  └────────────────────────────────┘│
│                                      │
│       [로그인 화면으로 돌아가기]     │
│                                      │
└──────────────────────────────────────┘
```

### 3.7 비밀번호 재설정 화면 (이메일 링크 클릭 후)

```
┌──────────────────────────────────────┐
│ [←] 비밀번호 재설정                  │
├──────────────────────────────────────┤
│                                      │
│  🔒 새로운 비밀번호를 설정하세요    │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  새 비밀번호                         │
│  ┌────────────────────────────────┐│
│  │ ••••••••••                     ││  [👁️]
│  └────────────────────────────────┘│
│                                      │
│  비밀번호 강도:                      │
│  ●●●●● 강력함                       │
│                                      │
│  ✅ 8자 이상                         │
│  ✅ 대문자 포함                      │
│  ✅ 소문자 포함                      │
│  ✅ 숫자 포함                        │
│  ✅ 특수문자 포함                    │
│                                      │
│  새 비밀번호 확인                    │
│  ┌────────────────────────────────┐│
│  │ ••••••••••                     ││  [👁️]
│  └────────────────────────────────┘│
│  ✅ 비밀번호가 일치합니다            │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  ┌────────────────────────────────┐│
│  │     비밀번호 변경 완료         ││
│  └────────────────────────────────┘│
│                                      │
└──────────────────────────────────────┘
```

### 3.8 소셜 로그인 첫 가입 시 추가 정보 입력

```
┌──────────────────────────────────────┐
│ [←] 추가 정보 입력                   │
├──────────────────────────────────────┤
│                                      │
│  거의 다 왔어요! 👏                  │
│  마지막으로 몇 가지만 알려주세요    │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  닉네임 *                            │
│  ┌────────────────────────────────┐│
│  │ Google에서 가져온 이름         ││
│  └────────────────────────────────┘│
│  다른 사용자들에게 표시될 이름입니다│
│                                      │
│ ────────────────────────────────────│
│                                      │
│  [ ] 서비스 이용약관 동의 (필수)    │
│  [ ] 개인정보 처리방침 동의 (필수)  │
│  [ ] 마케팅 정보 수신 동의 (선택)   │
│                                      │
│ ────────────────────────────────────│
│                                      │
│  ┌────────────────────────────────┐│
│  │        시작하기                ││
│  └────────────────────────────────┘│
│                                      │
└──────────────────────────────────────┘
```

---

## 4. 사용자 플로우

### 4.1 이메일 회원가입 플로우

```
시작
  ↓
로그인 선택 화면
  ↓
[이메일로 계속하기] 클릭
  ↓
회원가입 화면
  ↓
이메일 입력
  ↓
실시간 중복 확인 (debounce 500ms)
  ├─ 중복 → ❌ "이미 사용 중인 이메일입니다"
  └─ 사용 가능 → ✅ "사용 가능한 이메일입니다"
  ↓
비밀번호 입력
  ↓
실시간 강도 확인
  └─ 요구사항 체크 (대소문자, 숫자, 특수문자, 길이)
  ↓
비밀번호 확인 입력
  ↓
실시간 일치 확인
  ├─ 불일치 → ❌ "비밀번호가 일치하지 않습니다"
  └─ 일치 → ✅ "비밀번호가 일치합니다"
  ↓
닉네임 입력
  ↓
약관 동의 체크
  ├─ 필수 미동의 → 버튼 비활성화
  └─ 필수 동의 → 버튼 활성화
  ↓
[회원가입 완료하기] 클릭
  ↓
로딩 인디케이터 표시
  ↓
서버 요청 (POST /api/auth/register)
  ↓
성공 시:
  ├─ JWT 토큰 저장
  ├─ 환영 알림 표시
  └─ 온보딩 화면으로 이동
실패 시:
  └─ 에러 메시지 표시
```

### 4.2 이메일 로그인 플로우

```
시작
  ↓
로그인 선택 화면
  ↓
[이메일로 계속하기] 클릭
  ↓
로그인 화면
  ↓
이메일 입력
  ↓
비밀번호 입력
  ↓
[자동 로그인] 체크 (선택)
  ↓
[로그인하기] 클릭
  ↓
로딩 인디케이터 표시
  ↓
서버 요청 (POST /api/auth/login)
  ↓
성공 시:
  ├─ JWT 토큰 저장
  ├─ 자동 로그인 체크 시 Refresh Token 저장
  └─ 홈 화면으로 이동
실패 시:
  ├─ 401 Unauthorized → "이메일 또는 비밀번호가 올바르지 않습니다"
  └─ 기타 에러 → 에러 메시지 표시
```

### 4.3 소셜 로그인 플로우 (Google)

```
시작
  ↓
로그인 선택 화면
  ↓
[Google로 계속하기] 클릭
  ↓
Google 로그인 페이지로 리다이렉트
  ↓
사용자 Google 계정으로 로그인
  ↓
권한 동의 화면
  ├─ 취소 → 로그인 선택 화면으로 돌아가기
  └─ 동의
  ↓
Authorization Code 받음
  ↓
앱으로 리다이렉트 (with code)
  ↓
로딩 인디케이터 표시
  ↓
서버 요청 (POST /api/auth/social/google)
  ↓
서버에서 처리:
  ├─ Google API로 Access Token 교환
  ├─ 사용자 프로필 조회
  ├─ 이메일로 기존 사용자 확인
  └─ 있으면: 로그인
      없으면: 신규 가입
  ↓
기존 사용자:
  ├─ JWT 토큰 발급
  └─ 홈 화면으로 이동
신규 사용자:
  ├─ 추가 정보 입력 화면
  ├─ 닉네임 확인/수정
  ├─ 약관 동의
  ├─ JWT 토큰 발급
  └─ 온보딩 화면으로 이동
```

### 4.4 비밀번호 찾기 플로우

```
시작
  ↓
로그인 화면
  ↓
[비밀번호를 잊으셨나요?] 클릭
  ↓
비밀번호 찾기 화면 (1단계)
  ↓
이메일 입력
  ↓
[재설정 링크 보내기] 클릭
  ↓
로딩 인디케이터 표시
  ↓
서버 요청 (POST /api/auth/forgot-password)
  ↓
성공 시:
  └─ 이메일 전송 완료 화면 (2단계)
실패 시:
  └─ 에러 메시지 표시
  ↓
사용자 이메일 확인
  ↓
재설정 링크 클릭 (이메일에서)
  ↓
앱 또는 웹으로 이동
  ↓
토큰 검증
  ├─ 유효 → 비밀번호 재설정 화면
  └─ 무효/만료 → 에러 화면 ("링크가 만료되었습니다")
  ↓
새 비밀번호 입력
  ↓
새 비밀번호 확인 입력
  ↓
[비밀번호 변경 완료] 클릭
  ↓
서버 요청 (POST /api/auth/reset-password)
  ↓
성공 시:
  ├─ 성공 메시지 표시
  └─ 로그인 화면으로 이동 (3초 후)
실패 시:
  └─ 에러 메시지 표시
```

### 4.5 자동 로그인 플로우

```
앱 시작
  ↓
스플래시 화면
  ↓
Refresh Token 확인
  ├─ 없음 → 로그인 선택 화면
  └─ 있음
  ↓
서버 요청 (POST /api/auth/refresh)
  Headers: { Authorization: "Bearer <refresh_token>" }
  ↓
성공 시:
  ├─ 새로운 Access Token 받음
  ├─ 토큰 저장
  └─ 홈 화면으로 이동
실패 시 (토큰 만료/무효):
  ├─ 저장된 토큰 삭제
  └─ 로그인 선택 화면
```

---

## 5. 기술 구현

### 5.1 데이터베이스 스키마

#### **users 테이블 (MySQL)**

```sql
CREATE TABLE users (
  user_id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),  -- bcrypt 해시 (소셜 로그인 시 NULL)
  nickname VARCHAR(50) NOT NULL,
  profile_image_url VARCHAR(500),
  job_category VARCHAR(100),
  auth_provider ENUM('email', 'google', 'kakao') NOT NULL,
  is_email_verified BOOLEAN DEFAULT FALSE,
  marketing_agreed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_auth_provider (auth_provider)
);
```

#### **user_social_accounts 테이블 (MySQL)**

```sql
CREATE TABLE user_social_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  provider ENUM('google', 'kakao') NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  access_token TEXT,  -- 암호화 저장 권장
  refresh_token TEXT,  -- 암호화 저장 권장
  token_expires_at TIMESTAMP,
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY unique_provider_user (provider, provider_user_id),
  INDEX idx_user_id (user_id)
);
```

#### **refresh_tokens 테이블 (MySQL)**

```sql
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);
```

#### **password_reset_tokens 테이블 (MySQL)**

```sql
CREATE TABLE password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id)
);
```

### 5.2 비밀번호 해싱 (bcrypt)

```typescript
import bcrypt from 'bcrypt';

// 비밀번호 해싱
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// 비밀번호 검증
export async function verifyPassword(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// 사용 예시
const password = "SecurePass123!";
const hashed = await hashPassword(password);
// $2b$10$N9qo8uLOickgx2ZMRZoMye...

const isValid = await verifyPassword(password, hashed);
// true
```

### 5.3 JWT 토큰 생성/검증

```typescript
import jwt from 'jsonwebtoken';

interface TokenPayload {
  user_id: string;
  email: string;
  nickname: string;
  auth_provider: string;
}

// Access Token 생성 (15분)
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m'
  });
}

// Refresh Token 생성 (7일)
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d'
  });
}

// 토큰 검증
export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

// 사용 예시
const payload = {
  user_id: 'uuid-v4',
  email: 'user@example.com',
  nickname: '최수안',
  auth_provider: 'email'
};

const accessToken = generateAccessToken(payload);
const refreshToken = generateRefreshToken(payload);
```

### 5.4 이메일 중복 확인 (실시간)

```typescript
// 프론트엔드 (React Native)
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

function EmailInput() {
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Debounced 이메일 중복 확인 (500ms 대기)
  const checkEmailAvailability = debounce(async (email: string) => {
    if (!email || !isValidEmail(email)) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(`/api/auth/check-email?email=${email}`);
      const data = await response.json();
      setIsAvailable(data.available);
    } catch (error) {
      console.error('이메일 확인 실패:', error);
    } finally {
      setIsChecking(false);
    }
  }, 500);

  useEffect(() => {
    checkEmailAvailability(email);
  }, [email]);

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="example@domain.com"
      />
      {isChecking && <Text>확인 중...</Text>}
      {isAvailable === true && <Text style={{color: 'green'}}>✅ 사용 가능한 이메일입니다</Text>}
      {isAvailable === false && <Text style={{color: 'red'}}>❌ 이미 사용 중인 이메일입니다</Text>}
    </View>
  );
}
```

```typescript
// 백엔드 (Node.js + Express)
router.get('/check-email', async (req, res) => {
  const { email } = req.query;

  // 이메일 형식 검증
  if (!isValidEmail(email as string)) {
    return res.status(400).json({
      available: false,
      message: '유효하지 않은 이메일 형식입니다'
    });
  }

  // 데이터베이스에서 중복 확인
  const existingUser = await User.findOne({ email });

  res.json({
    available: !existingUser,
    message: existingUser 
      ? '이미 사용 중인 이메일입니다' 
      : '사용 가능한 이메일입니다'
  });
});
```

### 5.5 비밀번호 강도 검증

```typescript
// 비밀번호 강도 계산
export function calculatePasswordStrength(password: string): {
  score: number; // 0-5
  label: string; // '매우 약함', '약함', '보통', '강함', '매우 강함'
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
} {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;

  const labels = ['매우 약함', '약함', '보통', '강함', '매우 강함'];
  const label = score === 5 ? labels[4] : 
                score === 4 ? labels[3] : 
                score === 3 ? labels[2] : 
                score === 2 ? labels[1] : labels[0];

  return { score, label, checks };
}

// 사용 예시
const result = calculatePasswordStrength("SecurePass123!");
// {
//   score: 5,
//   label: '매우 강함',
//   checks: {
//     length: true,
//     lowercase: true,
//     uppercase: true,
//     number: true,
//     special: true
//   }
// }
```

### 5.6 소셜 로그인 구현 (Google)

```typescript
// routes/auth.routes.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Passport 설정
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 이메일로 기존 사용자 찾기
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        // 신규 사용자 생성
        user = await User.create({
          user_id: uuidv4(),
          email: profile.emails[0].value,
          nickname: profile.displayName,
          profile_image_url: profile.photos[0].value,
          auth_provider: 'google',
          is_email_verified: true
        });

        // 소셜 계정 정보 저장
        await SocialAccount.create({
          user_id: user.user_id,
          provider: 'google',
          provider_user_id: profile.id,
          email: profile.emails[0].value,
          access_token: accessToken,
          refresh_token: refreshToken
        });
      } else {
        // 기존 사용자 마지막 로그인 시간 업데이트
        await User.update(
          { last_login_at: new Date() },
          { where: { user_id: user.user_id } }
        );
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Google 로그인 시작
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Google 콜백
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  (req, res) => {
    // JWT 토큰 생성
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    // Refresh Token DB 저장
    await RefreshToken.create({
      user_id: req.user.user_id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // 앱으로 리다이렉트 (딥링크)
    res.redirect(`ainus://auth?access_token=${accessToken}&refresh_token=${refreshToken}`);
  }
);
```

---

## 6. 보안 정책

### 6.1 비밀번호 정책

```
✅ 최소 8자, 최대 72자
✅ 영문 대소문자, 숫자, 특수문자 조합 필수
✅ bcrypt 해싱 (Salt rounds: 10)
✅ 이전 비밀번호와 동일 불가 (변경 시)
✅ 연속된 문자 3개 이상 금지 (예: "aaa", "123")
```

### 6.2 JWT 보안

```
✅ Access Token: 15분 유효기간
✅ Refresh Token: 7일 유효기간
✅ Refresh Token은 DB에 저장 및 검증
✅ 로그아웃 시 Refresh Token 무효화
✅ Token Rotation (갱신 시 새로운 Refresh Token 발급)
✅ HTTPS 통신 필수
```

### 6.3 계정 보안

```
✅ 로그인 실패 5회 시 계정 잠금 (15분)
✅ 비밀번호 재설정 링크 유효기간: 1시간
✅ 비밀번호 재설정 후 모든 기기에서 로그아웃
✅ 의심스러운 로그인 감지 (새로운 기기/IP)
✅ 2단계 인증 (추후 구현)
```

### 6.4 데이터 보호

```
✅ 소셜 계정 토큰 암호화 저장
✅ HTTPS Only 쿠키 (Refresh Token)
✅ SQL Injection 방지 (Prepared Statements)
✅ XSS 공격 방지 (입력 값 sanitization)
✅ CSRF 토큰 사용 (웹 환경)
```

---

## 7. 에러 처리

### 7.1 에러 코드 정의

```typescript
enum AuthErrorCode {
  // 회원가입 에러
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  NICKNAME_ALREADY_EXISTS = 'NICKNAME_ALREADY_EXISTS',
  
  // 로그인 에러
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  
  // 토큰 에러
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  
  // 비밀번호 재설정 에러
  RESET_TOKEN_EXPIRED = 'RESET_TOKEN_EXPIRED',
  RESET_TOKEN_USED = 'RESET_TOKEN_USED',
  RESET_TOKEN_INVALID = 'RESET_TOKEN_INVALID',
  
  // 소셜 로그인 에러
  OAUTH_ERROR = 'OAUTH_ERROR',
  OAUTH_CANCELLED = 'OAUTH_CANCELLED',
  
  // 기타
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}
```

### 7.2 사용자 친화적 에러 메시지

```typescript
const errorMessages: Record<AuthErrorCode, string> = {
  // 회원가입
  [AuthErrorCode.EMAIL_ALREADY_EXISTS]: '이미 가입된 이메일입니다.',
  [AuthErrorCode.INVALID_EMAIL_FORMAT]: '올바른 이메일 형식이 아닙니다.',
  [AuthErrorCode.WEAK_PASSWORD]: '비밀번호가 너무 약합니다. 대소문자, 숫자, 특수문자를 포함해주세요.',
  [AuthErrorCode.NICKNAME_ALREADY_EXISTS]: '이미 사용 중인 닉네임입니다.',
  
  // 로그인
  [AuthErrorCode.INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다.',
  [AuthErrorCode.ACCOUNT_LOCKED]: '로그인 시도 횟수 초과로 계정이 잠겼습니다. 15분 후 다시 시도해주세요.',
  [AuthErrorCode.EMAIL_NOT_VERIFIED]: '이메일 인증이 필요합니다.',
  
  // 토큰
  [AuthErrorCode.TOKEN_EXPIRED]: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
  [AuthErrorCode.INVALID_TOKEN]: '유효하지 않은 인증 정보입니다.',
  [AuthErrorCode.TOKEN_REVOKED]: '로그인 정보가 무효화되었습니다. 다시 로그인해주세요.',
  
  // 비밀번호 재설정
  [AuthErrorCode.RESET_TOKEN_EXPIRED]: '비밀번호 재설정 링크가 만료되었습니다. 다시 요청해주세요.',
  [AuthErrorCode.RESET_TOKEN_USED]: '이미 사용된 재설정 링크입니다.',
  [AuthErrorCode.RESET_TOKEN_INVALID]: '유효하지 않은 재설정 링크입니다.',
  
  // 소셜 로그인
  [AuthErrorCode.OAUTH_ERROR]: '소셜 로그인에 실패했습니다. 다시 시도해주세요.',
  [AuthErrorCode.OAUTH_CANCELLED]: '소셜 로그인이 취소되었습니다.',
  
  // 기타
  [AuthErrorCode.SERVER_ERROR]: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [AuthErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.'
};
```

### 7.3 에러 처리 예시

```typescript
// 프론트엔드 에러 핸들링
async function handleLogin(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      
      // 에러 코드에 따라 처리
      switch (error.code) {
        case AuthErrorCode.INVALID_CREDENTIALS:
          showError('이메일 또는 비밀번호가 올바르지 않습니다.');
          break;
        case AuthErrorCode.ACCOUNT_LOCKED:
          showError('로그인 시도 횟수 초과로 계정이 잠겼습니다.');
          break;
        default:
          showError('로그인에 실패했습니다.');
      }
      return;
    }

    const data = await response.json();
    // 로그인 성공 처리
    saveTokens(data.access_token, data.refresh_token);
    navigateToHome();
  } catch (error) {
    showError('네트워크 오류가 발생했습니다.');
  }
}
```

---

## 8. API 명세

### 8.1 회원가입

**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "nickname": "최수안",
  "marketing_agreed": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "uuid-v4",
      "email": "user@example.com",
      "nickname": "최수안",
      "auth_provider": "email",
      "created_at": "2025-01-16T10:00:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 900
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "이미 가입된 이메일입니다."
  }
}
```

---

### 8.2 로그인

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "uuid-v4",
      "email": "user@example.com",
      "nickname": "최수안",
      "auth_provider": "email"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 900
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다."
  }
}
```

---

### 8.3 토큰 갱신

**POST** `/api/auth/refresh`

**Request Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900
  }
}
```

---

### 8.4 로그아웃

**POST** `/api/auth/logout`

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

---

### 8.5 비밀번호 재설정 요청

**POST** `/api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "비밀번호 재설정 링크를 이메일로 전송했습니다."
}
```

---

### 8.6 비밀번호 재설정

**POST** `/api/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "new_password": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "비밀번호가 성공적으로 변경되었습니다."
}
```

---

### 8.7 이메일 중복 확인

**GET** `/api/auth/check-email?email=user@example.com`

**Response (200 OK):**
```json
{
  "available": true,
  "message": "사용 가능한 이메일입니다."
}
```

---

### 8.8 소셜 로그인 (Google)

**GET** `/api/auth/google`
→ Google 로그인 페이지로 리다이렉트

**GET** `/api/auth/google/callback`
→ Google 인증 후 콜백
→ 앱으로 리다이렉트: `ainus://auth?access_token=...&refresh_token=...`

---

### 8.9 소셜 로그인 (Kakao)

**GET** `/api/auth/kakao`
→ Kakao 로그인 페이지로 리다이렉트

**GET** `/api/auth/kakao/callback`
→ Kakao 인증 후 콜백
→ 앱으로 리다이렉트: `ainus://auth?access_token=...&refresh_token=...`

---

## 9. 개발 우선순위

### Phase 1 (필수 - Week 1-2)
1. ✅ 이메일 회원가입/로그인
2. ✅ JWT 토큰 발급/검증
3. ✅ 비밀번호 해싱 (bcrypt)
4. ✅ 이메일 중복 확인
5. ✅ 비밀번호 강도 검증

### Phase 2 (중요 - Week 3-4)
6. ✅ Google 소셜 로그인
7. ✅ Kakao 소셜 로그인
8. ✅ 자동 로그인 (Refresh Token)
9. ✅ 로그아웃 기능

### Phase 3 (추가 - Week 5-6)
10. ✅ 비밀번호 찾기/재설정
11. ⭕ 이메일 인증 (선택)
12. ⭕ 계정 잠금 (로그인 실패 5회)

### Phase 4 (고급 - Week 7+)
13. ⭕ 2단계 인증 (OTP)
14. ⭕ 의심스러운 로그인 감지
15. ⭕ 소셜 계정 연동 해제

---

## 10. 테스트 케이스

### 10.1 회원가입 테스트

```typescript
describe('회원가입 테스트', () => {
  test('정상 회원가입', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        nickname: '테스트유저'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('test@example.com');
  });

  test('이메일 중복 시 에러', async () => {
    // 첫 번째 회원가입
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'duplicate@example.com',
        password: 'SecurePass123!',
        nickname: '유저1'
      });

    // 두 번째 회원가입 (동일 이메일)
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'duplicate@example.com',
        password: 'AnotherPass123!',
        nickname: '유저2'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  test('약한 비밀번호 에러', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test2@example.com',
        password: 'weak',
        nickname: '테스트'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('WEAK_PASSWORD');
  });
});
```

### 10.2 로그인 테스트

```typescript
describe('로그인 테스트', () => {
  beforeEach(async () => {
    // 테스트 유저 생성
    await User.create({
      email: 'login@example.com',
      password: await hashPassword('SecurePass123!'),
      nickname: '로그인테스트'
    });
  });

  test('정상 로그인', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'SecurePass123!'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.data.tokens.access_token).toBeDefined();
    expect(response.body.data.tokens.refresh_token).toBeDefined();
  });

  test('잘못된 비밀번호', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'WrongPassword123!'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });
});
```

---

## 📋 체크리스트

### 필수 구현 항목

- [x] 이메일 회원가입
- [x] 이메일 로그인
- [x] JWT 토큰 발급
- [x] 비밀번호 bcrypt 해싱
- [x] 이메일 중복 확인
- [x] 비밀번호 강도 검증
- [x] Google 소셜 로그인
- [x] Kakao 소셜 로그인
- [x] 자동 로그인 (Refresh Token)
- [x] 로그아웃
- [x] 비밀번호 찾기/재설정

### 선택 구현 항목

- [ ] 이메일 인증
- [ ] 계정 잠금 (로그인 실패)
- [ ] 2단계 인증
- [ ] 의심스러운 로그인 감지
- [ ] 소셜 계정 연동 해제

---

**Last Update: 2025.01 | Ainus Development Team**
