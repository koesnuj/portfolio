# 🚀 TMS_v2 Playwright E2E 테스트 빠른 시작

## 1️⃣ 준비

### 의존성 설치
```bash
cd projects/playwright
npm install
```

### Playwright 브라우저 설치
```bash
npx playwright install
```

## 2️⃣ 테스트 계정 설정

**중요**: TMS_v2에 테스트 계정이 등록되어 있어야 합니다!

1. https://tms-v2-phi.vercel.app/ 접속
2. 회원가입: 본인 계정으로 등록
3. `config/test-config.js`에서 계정 정보 설정

```javascript
// config/test-config.js
testAccount: {
  email: 'your-email@test.com',
  password: 'your-password',
  username: 'Your Name'
}
```

## 3️⃣ 테스트 실행

### 전체 E2E 테스트 실행
```bash
npm test
```

### UI 모드로 실행 (추천)
```bash
npx playwright test --ui
```

실시간으로 테스트 진행을 확인하고 디버깅할 수 있습니다.

### 헤드 모드로 실행 (브라우저 보면서)
```bash
npx playwright test tests/tms/e2e/create-case-flow.spec.js --headed
```

### 디버그 모드
```bash
npx playwright test tests/tms/e2e/create-case-flow.spec.js --debug
```

단계별로 실행하며 디버깅할 수 있습니다.

### 태그별 실행
```bash
# E2E 테스트만
npx playwright test --grep @e2e

# 영상 녹화 테스트만
npx playwright test --grep @video
```

## 4️⃣ 리포트 확인

테스트 실행 후:
```bash
npx playwright show-report
```

또는 브라우저에서 직접 열기:
```
playwright-report/index.html
```

## 📊 테스트 결과

- **HTML 리포트**: `playwright-report/index.html`
  - 테스트 성공/실패 결과
  - 각 단계별 스크린샷
  - 상세 로그 및 실행 시간
  
- **영상 녹화**: `test-results/[테스트명]-chromium/video.webm`
  - 전체 테스트 과정 영상 (VLC Player 또는 Chrome에서 재생)
  
- **스크린샷**: `test-results/[테스트명]-chromium/*.png`
  - 각 단계별 화면 캡처

## 📹 영상 확인

테스트가 완료되면 `test-results` 폴더에서 녹화된 영상을 확인할 수 있습니다:

```bash
# 최신 테스트 결과 폴더 찾기
cd test-results
dir

# 영상 파일 위치
test-results/[테스트명]-chromium/video.webm
```

Chrome 브라우저나 VLC Player로 영상을 재생할 수 있습니다.

## 🎯 E2E 테스트 시나리오

테스트는 다음 플로우를 자동으로 실행합니다:

1. **로그인** - 이메일/비밀번호 입력 및 로그인
2. **Test Cases 이동** - 좌측 메뉴에서 Test Cases 클릭
3. **Add case** - 새 테스트케이스 생성 버튼 클릭
4. **정보 입력** - Title, Precondition, Steps, Expected Result 입력
5. **저장** - Save 버튼 클릭 및 성공 확인

각 단계는 콘솔에 상세하게 로그로 출력됩니다.

## 🐛 문제 해결

### 로그인 실패
- TMS_v2에 테스트 계정이 등록되어 있는지 확인
- `config/test-config.js`의 계정 정보 확인
- 헤드 모드(`--headed`)로 실행하여 로그인 화면 직접 확인

### 셀렉터 오류
- TMS_v2 사이트 구조가 변경되었을 수 있습니다
- `tests/tms/e2e/create-case-flow.spec.js`의 셀렉터 업데이트 필요
- UI 모드로 실행하여 요소 선택자 확인

### 타임아웃 오류
- 네트워크가 느린 경우 발생 가능
- `playwright.config.js`에서 timeout 설정 증가
- 또는 `create-case-flow.spec.js`의 `test.setTimeout()` 값 증가

### 영상이 저장되지 않음
- `playwright.config.js`의 `video: 'on'` 설정 확인
- `test-results` 폴더 권한 확인
- 충분한 디스크 공간 확인

## ⚙️ 설정 변경

### 영상 녹화 속도 조절

`playwright.config.js`에서 `slowMo` 값을 조절하세요:

```javascript
launchOptions: {
  slowMo: 1000, // 1초 대기 (영상 확인용)
  // slowMo: 500, // 0.5초 대기 (빠른 테스트)
  // slowMo: 0, // 대기 없음 (가장 빠름)
}
```

### 영상 녹화 설정 변경

```javascript
video: 'on',                 // 모든 테스트 녹화
// video: 'retain-on-failure', // 실패한 테스트만 녹화
// video: 'off',              // 녹화 안함
```

## 📝 다음 단계

- 새로운 테스트 시나리오 추가 (예: 테스트케이스 수정/삭제)
- CI/CD 파이프라인 통합 (GitHub Actions)
- 테스트 데이터 확장

---

더 자세한 내용은 [README.md](./README.md) 또는 [E2E_TEST_GUIDE.md](./E2E_TEST_GUIDE.md)를 참고하세요!
