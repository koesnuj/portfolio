# 🚀 TMS_v2 Playwright 테스트 빠른 시작

## 1️⃣ 준비

### 의존성 설치
```bash
cd playwright
npm install
```

### Playwright 브라우저 설치
```bash
npm run install-browsers
```

## 2️⃣ 테스트 계정 설정

**중요**: TMS_v2에 테스트 계정이 등록되어 있어야 합니다!

1. https://tms-v2-phi.vercel.app/ 접속
2. 회원가입: `test@test.com` / `test1234`
3. (또는) `config/test-config.js`에서 본인 계정으로 변경

```javascript
// config/test-config.js
testAccount: {
  email: 'your-email@test.com',
  password: 'your-password',
  username: 'Your Name'
}
```

## 3️⃣ 테스트 실행

### 전체 테스트 실행
```bash
npm test
```

### UI 모드로 실행 (추천)
```bash
npm run test:ui
```

### 특정 카테고리만 실행
```bash
# 로그인 테스트
npm run test:auth

# 테스트케이스 관리 테스트
npm run test:testcase

# 테스트 플랜 테스트
npm run test:plan

# 대시보드 테스트
npm run test:dashboard
```

### 태그별 실행
```bash
# Smoke 테스트만
npm run test:smoke

# Critical 테스트만
npm run test:critical
```

### 디버그 모드
```bash
npm run test:debug
```

## 4️⃣ 리포트 확인

테스트 실행 후:
```bash
npm run report
```

또는 브라우저에서 직접 열기:
```
playwright-report/index.html
```

## 📊 테스트 결과

- **HTML 리포트**: `playwright-report/index.html`
- **스크린샷**: `test-results/*/screenshot.png`
- **비디오**: `test-results/*/video.webm`

## 🐛 문제 해결

### 로그인 실패
- TMS_v2에 테스트 계정이 등록되어 있는지 확인
- `config/test-config.js`의 계정 정보 확인

### 셀렉터 오류
- TMS_v2 사이트 구조가 변경되었을 수 있습니다
- `utils/auth-helper.js`와 테스트 파일의 셀렉터 업데이트 필요

### 타임아웃 오류
- 네트워크가 느린 경우 발생 가능
- `playwright.config.js`에서 timeout 설정 증가

## 📝 다음 단계

- 새로운 테스트 시나리오 추가
- 테스트 데이터 확장
- CI/CD 통합

---

더 자세한 내용은 [README.md](./README.md)를 참고하세요!

