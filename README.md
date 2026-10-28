# JWT 인증 게시판

React와 Express를 활용해 구현한 웹서비스설계 JWT 인증 게시판 과제입니다.

## 작성자와 서비스 소개

- **학번 / 이름:** 202212205 / 이상현
- **서비스 목적과 대상 사용자:** 사용자가 게시글을 조회하고, 로그인 후 자신의 게시글을 작성·수정·삭제할 수 있는 웹 게시판입니다. JWT(JSON Web Token)를 이용해 사용자를 인증하고, 게시글 작성자와 로그인한 사용자를 비교해 수정·삭제 권한을 검사합니다. Alice와 Bob 테스트 계정을 이용하여 사용자별 접근 권한을 검증했습니다.
- **선택한 기술:** React + Vite / Node.js + Express / SQLite(sql.js)
- **주요 기능:** 공개 게시글 목록·상세 조회, 로그인, JWT 발급·검증, 게시글 작성·수정·삭제, 작성자 권한 검사, 토큰 만료 및 로그아웃, 입력값 검증

## 보고서와 테스트 증거

- [구현 보고서 PDF](docs/report.pdf)
- [테스트 증거 이미지](docs/evidence/)

## 프로젝트 구조

```text
JWT-Assignment/
├── README.md
├── .gitignore
├── frontend-react/
│   ├── package.json
│   ├── package-lock.json
│   └── src/
├── backend-express/
│   ├── package.json
│   ├── package-lock.json
│   └── src/
└── docs/
    ├── report.pdf
    └── evidence/
```

## 실행 환경

| 항목 | 사용 버전 |
|---|---|
| 운영체제 | Windows 11 |
| Node.js | 24.21.0 |
| React / React DOM | 19.3.0 |
| Vite | 8.3.4 |
| Express | 5.3.0 |
| jsonwebtoken | ^9.0.3 |
| sql.js | 1.14.2 |
| dotenv | 18.0.7 |
| 데이터 저장 | SQLite 파일 |

Node.js 최소 요구 버전은 20.19.0입니다.

## 설치와 실행

### 1. 저장소 복제

```bash
git clone https://github.com/lsanghyl/JWT-Assignment.git
cd JWT-Assignment
```

### 2. 백엔드 준비와 실행

```bash
cd backend-express
npm ci
```

JWT 서명을 위해 `JWT_SECRET` 환경변수를 설정해야 합니다. 64자리 16진수 키를 새로 생성합니다.

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

생성한 키는 공개 저장소에 기록하지 않습니다.

`backend-express/.env` 파일을 로컬에 생성하고 다음 내용을 작성합니다.

```dotenv
JWT_SECRET=여기에_새로_생성한_64자리_16진수_키
TOKEN_TTL=90
```

실제 키를 입력한 뒤 백엔드를 실행합니다.

```bash
npm start
```

개발 중에는 다음 명령을 사용할 수 있습니다.

```bash
npm run dev
```

- **백엔드 주소:** http://127.0.0.1:8000
- **JWT_SECRET:** 64자리 16진수 키 필수
- **TOKEN_TTL:** 기본 90초, 초 단위 양의 정수
- **만료 테스트:** `TOKEN_TTL=3`으로 변경 후 백엔드 재시작

백엔드 실행 후 로그인 API 등을 통해 정상 작동 여부를 확인할 수 있습니다.

### 3. 프론트엔드 빌드와 로컬 실행

백엔드를 실행한 상태에서 새로운 터미널을 엽니다.

프로젝트 루트에서 다음 명령어를 실행합니다.

```bash
cd frontend-react
npm ci
npm run build
npm run preview
```

브라우저 접속 주소:

http://127.0.0.1:4173

개발 서버는 다음과 같이 실행합니다.

```bash
npm run dev
```

개발 서버 주소는 http://127.0.0.1:5173 입니다.

프론트엔드의 `/api` 요청은 Vite 프록시를 통해 8000번 백엔드로 전달됩니다. 포트를 변경할 경우 `vite.config.js`의 프록시 설정도 수정해야 합니다.

프론트엔드와 백엔드는 각각의 터미널에서 `Ctrl+C`로 종료합니다. 프론트엔드 코드를 수정한 경우 다시 빌드한 뒤 preview를 실행하고, 백엔드 코드를 수정한 경우 서버를 재시작합니다.

### 4. 테스트 계정과 DB

| 사용자 | 이메일 | 실습용 비밀번호 |
|---|---|---|
| Alice | alice@class.test | Classroom!2026 |
| Bob | bob@class.test | Classroom!2026 |

- **DB 종류:** SQLite(sql.js)
- **기본 DB 파일:** `backend-express/data/board.sqlite`
- **DB 생성:** 서버 시작 시 필요한 DB 파일과 테스트 계정 준비
- **DB 초기화:** 백엔드를 종료하고 실습용 `data/board.sqlite` 파일을 삭제한 뒤 재시작
- **데이터 유지:** 서버를 재시작해도 저장한 게시글이 유지되는 것을 확인함(T15)

실제 DB 파일은 GitHub에 제출하지 않습니다.

## 구현 완료 범위

| 기능 | 완료 여부 | 주요 파일 또는 함수 |
|---|---|---|
| 공개 목록과 상세 조회 | 완료 | Express 게시글 API, React 게시판 화면 |
| 로그인과 JWT 발급 | 완료 | `auth.js`의 `issueToken()` |
| JWT 검증과 내 정보 조회 | 완료 | `auth.js`의 `currentUserId()` |
| 글 작성과 작성자 저장 | 완료 | Express 게시글 작성 API |
| 본인 글 수정·삭제 | 완료 | `auth.js`의 `assertOwner()` |
| 토큰 만료와 로그아웃 | 완료 | `auth.js`, `frontend-react/src/api.js` |
| 입력 오류와 권한 오류 처리 | 완료 | Express API의 오류 응답 처리 |

## 테스트 방법과 결과 요약

- **백엔드 자동 검사:** BE-01 총 23개 PASS
- **프론트엔드 자동 검사:** FE-04 총 5개 PASS
- **수동 검증:** T01~T17 시나리오 수행
- **권한 검사:** Alice의 게시글을 Bob이 수정하거나 삭제할 경우 `403 FORBIDDEN` 반환
- **정상 응답:** `200 OK`, `201 Created`, `204 No Content`
- **오류 응답:** `400 BAD_INPUT`, `401`, `403 FORBIDDEN`, `404 NOT_FOUND`
- **토큰 검증:** 토큰 누락, 서명 변조, 만료 상황에서 접근 거부 확인
- **데이터 유지:** 백엔드 재시작 후 게시글 유지 확인
- **204 응답:** 삭제 성공 시 빈 본문 확인

201 응답의 `Location` 헤더와 401 응답의 `WWW-Authenticate` 헤더는 별도 검증이 완료되지 않았으므로 확인된 결과로 기재하지 않습니다.

전체 테스트 과정과 결과는 [구현 보고서](docs/report.pdf), 화면 및 API 증거는 [테스트 증거 폴더](docs/evidence/)를 참고합니다.

## 핵심 구현 설명

1. 사용자가 이메일과 비밀번호로 로그인하면 백엔드가 계정 정보를 검증합니다.
2. 인증에 성공하면 `issueToken()`에서 JWT를 발급합니다.
3. 프론트엔드는 발급받은 JWT를 메모리에 보관하고 보호 API 요청에 `Authorization: Bearer` 헤더로 전달합니다.
4. 백엔드의 `currentUserId()`는 토큰 서명, 알고리즘, 발급자, 대상, 만료 시간 및 사용자 정보를 검증합니다.
5. 게시글 수정·삭제 시 `assertOwner()`가 로그인한 사용자와 게시글 작성자를 비교합니다.
6. 권한이 없으면 `403 FORBIDDEN`, 토큰이 유효하지 않으면 `401` 오류를 반환합니다.
7. 로그아웃하거나 인증이 만료되면 프론트엔드에서 보관 중인 토큰을 제거합니다.

## AI 활용 요약과 참고 자료

- **AI 사용 여부:** 사용
- **사용 도구:** ChatGPT
- **활용 목적:** JWT 인증 및 권한 검사 구현 보조, 오류 원인 분석, 테스트 시나리오 점검, 보고서 작성 보조
- **직접 검증:** API 응답 상태 및 오류 코드 확인, Alice/Bob 권한 검사, 토큰 변조·만료 테스트, 프론트엔드 기능 확인
- **상세 활용 기록:** 구현 보고서의 05장 참고

참고 자료:

- 웹서비스설계 수업 과제 공지 및 API 명세
- 웹서비스설계 구현 체크리스트 및 테스트 시나리오
- [Express 공식 문서](https://expressjs.com/)
- [React 공식 문서](https://react.dev/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

## 제출 확인

- [o] README 내용 및 실제 실행 명령 확인
- [o] 새 폴더에서 clone 후 설치·환경설정·빌드·실행
- [o] 4173번 빌드 화면에서 필수 기능 확인
- [o] GitHub 보고서와 증거 링크 확인
- [o] 저장소 열람·복제 권한 확인
- [o] 실제 비밀키·토큰·DB·node_modules 미포함 확인
- [o] 최종 커밋 SHA 확인 후 LMS 제출
