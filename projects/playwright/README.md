# TMS_v2 Playwright E2E 테스트 자동화 (포트폴리오)

## 📁 프로젝트 구조

```
playwright/
├── tests/
│   └── tms/                         # TMS_v2 테스트
│       ├── e2e/                     # E2E 전체 플로우 테스트
│       │   └── full-flow.spec.js   # 로그인부터 테스트케이스 생성까지
│       └── README.md
├── config/
│   └── test-config.js              # TMS 테스트 설정 (URL, 계정 정보)
├── test-results/                    # 테스트 결과 (스크린샷, 비디오)
├── playwright-report/               # HTML 테스트 리포트
├── package.json                     # 프로젝트 설정 및 npm scripts
├── playwright.config.js            # Playwright 설정
├── E2E_TEST_GUIDE.md               # E2E 테스트 가이드
├── QUICK_START.md                  # 빠른 시작 가이드
└── README.md                        # 프로젝트 문서
```

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# Playwright 브라우저 설치
npx playwright install

# 테스트 실행
npm test
```

## 🎯 테스트 실행

```bash
# E2E 테스트 실행
npm test

# UI 모드로 실행
npx playwright test --ui

# 헤드 모드로 실행 (브라우저 보면서)
npx playwright test tests/tms/e2e/full-flow.spec.js --headed

# 디버그 모드
npx playwright test tests/tms/e2e/full-flow.spec.js --debug

# 리포트 보기
npx playwright show-report
```

## 🌐 테스트 대상

**TMS_v2 (Test Management System v2)**
- URL: https://tms-v2-phi.vercel.app/
- 설명: 테스트케이스 관리 시스템

## 📊 리포트

### **포트폴리오 샘플 리포트**
- 📁 **[docs/reports/index.html](./docs/reports/index.html)** - 샘플 HTML 리포트 (포트폴리오용)
- 📸 **[docs/screenshots/](./docs/screenshots/)** - 주요 테스트 결과 스크린샷
- 📖 **[docs/README.md](./docs/README.md)** - 리포트 사용 가이드

### **테스트 실행 결과**
- `playwright-report/` - 최신 HTML 리포트 (테스트 실행 후 생성)
- `test-results/` - 테스트 결과, 스크린샷, 비디오

**리포트 확인:**
```bash
npx playwright show-report
```

## 🎯 E2E 테스트 시나리오

### **전체 플로우: 로그인 → 테스트케이스 생성**

1. **로그인**
   - 로그인 페이지 접속
   - 이메일/비밀번호 입력
   - 로그인 버튼 클릭
   - 로그인 성공 확인

2. **Test Cases 페이지 이동**
   - 좌측 네비게이션에서 "Test Cases" 클릭
   - 페이지 로드 확인

3. **테스트케이스 생성**
   - "Add case" 버튼 클릭
   - 모달 팝업 열림

4. **정보 입력**
   - Title 입력
   - Precondition 입력
   - Steps 입력
   - Expected Result 입력

5. **저장**
   - "Save" 버튼 클릭
   - 성공 메시지 확인

## 🎯 테스트 태그 시스템

- `@e2e` - End-to-End 전체 플로우 테스트
- `@video` - 영상 녹화 테스트

```bash
# 태그별 실행
npx playwright test --grep @e2e
npx playwright test --grep @video
```

## 🔧 새로운 테스트 파일 만들기

```javascript
const { test, expect } = require('@playwright/test');
const config = require('../../../config/test-config');

test.describe('새로운 기능 테스트', () => {
  
  test('기능 테스트 @e2e', async ({ page }) => {
    // 로그인
    await page.goto(config.urls.login());
    await page.waitForLoadState('networkidle');
    
    // 테스트 코드 작성
    // ...
  });
});
```

## 📋 주요 기능

### ✅ 완료된 자동화
- **E2E 전체 플로우**: 로그인부터 테스트케이스 생성까지 전체 시나리오
- **자동 로그인**: 이메일/비밀번호 자동 입력 및 로그인
- **테스트케이스 생성**: Add case → 정보 입력 → Save
- **스크린샷/비디오**: 모든 테스트 자동 녹화
- **상세 로그**: 각 단계별 진행 상황 콘솔 출력

## 🛠️ 개발 팁

1. **디버깅**: `--headed` 또는 `--debug` 옵션 사용
2. **UI 모드**: `npx playwright test --ui`로 실시간 디버깅
3. **특정 테스트만 실행**: `npx playwright test tests/tms/e2e/full-flow.spec.js`
4. **태그별 실행**: `npx playwright test --grep @e2e`
5. **영상 확인**: `test-results/` 폴더에서 `video.webm` 파일 재생

## 📝 주의사항

- 브라우저 자동화 중에는 수동 조작을 피하세요
- 테스트 계정 정보는 `config/test-config.js`에서 관리됩니다
- TMS_v2 사이트가 변경되면 셀렉터를 업데이트해야 할 수 있습니다

## 🔄 테스트 계정 설정

`config/test-config.js` 파일에서 테스트 계정을 설정하세요:

```javascript
testAccount: {
  email: 'test@test.com',
  password: 'test1234',
  username: 'Test User'
}
```

⚠️ **중요**: TMS_v2에 해당 계정이 등록되어 있어야 합니다!

## 📹 영상 녹화

모든 E2E 테스트는 자동으로 영상이 녹화됩니다:

- 저장 위치: `test-results/[테스트명]-[브라우저]/video.webm`
- 재생 방법: VLC Player, Chrome 브라우저 등
- 설정 변경: `playwright.config.js`의 `video` 옵션 수정

---

**포트폴리오 프로젝트**: TMS_v2 E2E 테스트 자동화  
**테스트 대상**: https://tms-v2-phi.vercel.app/  
**테스트 프레임워크**: Playwright
