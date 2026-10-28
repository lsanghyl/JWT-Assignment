# JWT 기반 게시판 웹 서비스

## 1. 프로젝트 소개

본 프로젝트는 React와 Express를 활용하여 JWT(JSON Web Token) 기반 사용자 인증과 게시글 작성자 권한 관리를 구현한 웹 서비스입니다.

사용자는 로그인하여 게시글을 작성할 수 있으며, 게시글의 수정과 삭제는 작성자 본인만 수행할 수 있습니다.

## 2. 기술 스택

- Frontend: React, Vite, JavaScript
- Backend: Node.js, Express
- Database: SQLite
- Authentication: JWT (HS256)

## 3. 주요 기능

### 사용자 인증
- 이메일과 비밀번호를 이용한 로그인
- 로그인 성공 시 JWT 발급
- JWT를 이용한 사용자 인증
- JWT 만료 및 변조 검증
- 로그아웃 시 메모리의 토큰 삭제

### 게시판
- 게시글 목록 및 상세 조회
- 게시글 작성, 수정, 삭제
- 작성자 본인만 수정 및 삭제 가능
- 다른 사용자의 수정·삭제 요청 시 403 오류 반환

### 프론트엔드
- 로그인 사용자 정보 표시
- JWT를 메모리에만 저장
- API 요청 시 Bearer 토큰 자동 전송
- 401 응답 시 로그인 상태 초기화
- 작성자에 따라 수정·삭제 버튼 표시

## 4. 실행 방법

### Backend

powershell
cd backend-express
npm install

$env:JWT_SECRET = node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))"

npm run dev

백엔드 기본 주소: `http://localhost:8000`

### Frontend

별도 터미널에서 실행합니다.

powershell
cd frontend-react
npm install
npm run dev

프론트엔드 기본 주소: `http://localhost:5173`

## 5. 테스트 계정

| 사용자 | 이메일 | 비밀번호 |
|---|---|---|
| Alice | alice@class.test | Classroom!2026 |
| Bob | bob@class.test | Classroom!2026 |

## 6. 주요 API

| Method | Endpoint | 설명 |
|---|---|---|
| POST | /api/auth/login | 로그인 및 JWT 발급 |
| GET | /api/me | 로그인 사용자 조회 |
| GET | /api/posts | 게시글 목록 |
| GET | /api/posts/:id | 게시글 상세 |
| POST | /api/posts | 게시글 작성 |
| PUT | /api/posts/:id | 게시글 수정 |
| DELETE | /api/posts/:id | 게시글 삭제 |

## 7. 인증 및 권한 정책

- JWT 알고리즘: HS256
- 기본 JWT 유효기간: 90초
- 인증 방식: Authorization: Bearer TOKEN
- JWT는 브라우저 메모리에만 보관
- 인증되지 않은 요청: 401 Unauthorized
- 권한이 없는 수정·삭제 요청: 403 Forbidden
- 토큰 만료: TOKEN_EXPIRED
- 유효하지 않은 토큰: INVALID_TOKEN

## 8. 테스트 결과

- BE-01 JWT 발급 자동 테스트: 23개 PASS
- Alice 및 Bob 로그인과 사용자 조회 성공
- JWT 변조 시 401 응답 확인
- JWT 만료 시 TOKEN_EXPIRED 확인
- 타인 게시글 수정·삭제 시 403 응답 확인
- FE-01~04 로그인, 토큰 전송, 오류 처리, 작성자별 버튼 표시 확인

## 9. 보안 고려사항

JWT 비밀키는 환경변수로 관리하며 GitHub에 업로드하지 않습니다. 사용자 비밀번호는 해시를 이용해 검증합니다. 프론트엔드의 버튼 표시 여부와 관계없이 서버에서 작성자 권한을 검사합니다.
