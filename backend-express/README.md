# Express 백엔드 시작 코드

Node.js 20.19 이상. 이 폴더에서 실행합니다.

```sh
npm ci
npm start
```

주소: http://127.0.0.1:8000/api/health . 선택한 프론트는 별도 터미널에서 실행합니다.

JWT를 구현할 때 `.env.example`을 `.env`로 복사한 뒤 JWT_SECRET을 새 난수로 바꾸세요. 예시 키는 실제 키가 아닙니다. 아래 명령은 키 값을 출력하므로 본인 로컬에서만 사용하고 결과를 제출물에 넣지 마세요.

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

dotenv가 `.env`를 읽습니다. `src/config.js`가 키의 64자리 16진수 형식과 TTL을 검사하고 32바이트 Buffer로 변환합니다. 예시 키·빈 값·잘못된 형식은 서버 시작을 거부합니다. `src/auth.js`의 issueToken은 HS256으로 sub·exp·iss·aud를 발급합니다.

`src/auth.js`의 BE-01~03이 학생 구현 범위입니다. `src/app.js`는 라우트와 입력 검사, `src/store.js`는 SQLite 저장, `src/users.js`는 제공 계정과 scrypt 비밀번호 검증입니다.

DB는 `data/board.sqlite`에 생성됩니다. 초기화가 필요하면 서버 종료 후 이 실습 폴더의 data/board.sqlite만 삭제하고 재실행하세요. 기존 실습 글이 지워집니다. sql.js는 메모리의 SQLite 내용을 변경 때마다 파일로 저장합니다. 단일 서버 프로세스로 실행하세요.

Windows PowerShell에서 짧은 TTL로 테스트할 때: `$env:TOKEN_TTL="3"` 설정 후 `npm start`. macOS/Linux: `TOKEN_TTL=3 npm start`.

## 현재 구현 상태

BE-01만 완료했습니다. BE-02의 고정 사용자 ID와 BE-03의 권한 TODO는 남아 있습니다. 프론트 로그인 연결도 아직 미완성입니다. 최종 제출본으로 사용하기 전에 다음 단계를 구현하세요.

검사: `node test-be01.mjs` (임시 포트 18081, 테스트 키는 메모리에서 생성). 테스트 DB는 `../../work/be01-test.sqlite`를 사용합니다.
