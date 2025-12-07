# TMS_v2 Playwright E2E 테스트 자동화 (포트폴리오)

## 📁 프로젝트 구조

```
playwright/
├── tests/
│   └── tms/                         # TMS_v2 테스트
│       ├── auth/                    # 인증 테스트
│       ├── testcase/                # 테스트케이스 관리 테스트
│       ├── plan/                    # 테스트 플랜 관리 테스트
│       ├── dashboard/               # 대시보드 테스트
│       ├── e2e/                     # E2E 전체 플로우 테스트
│       └── README.md
├── utils/
│   ├── auth-helper.js               # TMS 로그인/로그아웃 헬퍼
│   ├── report-helper.js             # 리포트 관리 모듈
│   └── signup-helper.js             # 회원가입 헬퍼
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
# 테스트 실행
npm test

# UI 모드로 실행
npx playwright test --ui

# 리포트 보기
npx playwright show-report
```

## 🌐 테스트 대상

**TMS_v2 (Test Management System v2)**
- URL: https://tms-v2-phi.vercel.app/
- 설명: 테스트케이스 관리 시스템

## 📊 리포트

### **테스트 결과**
- `playwright-report/` - 최신 HTML 리포트
- `test-results/` - 테스트 결과, 스크린샷, 비디오

## 🎯 테스트 종류

### **인증 (auth)**
- **로그인**: 정상 로그인, 로그아웃, 실패 케이스
- **회원가입**: 신규 사용자 등록 (필요시)

### **테스트케이스 관리 (testcase)**
- **CRUD**: 생성, 조회, 수정, 삭제
- **폴더 관리**: 폴더 구조 확인 및 관리
- **목록 조회**: 테스트케이스 목록 표시

### **테스트 플랜 (plan)**
- **플랜 생성**: 새 테스트 플랜 생성
- **플랜 관리**: 플랜 목록 조회 및 관리
- **플랜 실행**: 테스트 실행 및 결과 기록

### **대시보드 (dashboard)**
- **통계 확인**: 테스트 진행률 및 통계 위젯
- **네비게이션**: 메뉴 이동 및 페이지 전환
- **전체 현황**: 프로젝트 전체 현황 확인

## 🎯 테스트 태그 시스템

- `@smoke` - 기본 동작 확인 (페이지 접속, 로그인 등)
- `@critical` - 핵심 기능 테스트 (CRUD, 플랜 실행 등)
- `@regression` - 회귀 테스트

## 🔧 공통 모듈 사용법

### **새로운 테스트 파일 만들기**
```javascript
const { test, expect } = require('@playwright/test');
const { loginToTMS } = require('../../../utils/auth-helper');
const config = require('../../../config/test-config');

test.describe('새로운 기능 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 자동 로그인
    await loginToTMS(page);
  });

  test('기능 테스트 @smoke', async ({ page }) => {
    // 로그인된 상태로 시작
    await page.goto(config.urls.testcases());
    
    // 테스트 코드 작성
    // ...
  });
});
```

### **사용 가능한 함수들**
```javascript
const { 
  loginToTMS,        // TMS 로그인
  registerToTMS,     // 회원가입
  logoutFromTMS      // 로그아웃
} = require('../../../utils/auth-helper');
```

## 📋 주요 기능

### ✅ 완료된 자동화
- **로그인/로그아웃**: TMS_v2 자동 로그인 및 로그아웃
- **인증 테스트**: 정상/비정상 로그인 시나리오
- **테스트케이스 관리**: 목록 조회, 생성 버튼 확인, 폴더 구조
- **테스트 플랜**: 플랜 목록 조회, 생성, 상세 페이지 접근
- **대시보드**: 통계 위젯, 네비게이션, 페이지 전환
- **스크린샷/비디오**: 모든 테스트 자동 녹화

## 🛠️ 개발 팁

1. **새로운 테스트 만들 때**: `test.beforeEach`에서 `loginToTMS(page)` 사용
2. **로그인 로직 변경 시**: `utils/auth-helper.js`만 수정
3. **디버깅**: `--headed` 또는 `--debug` 옵션 사용
4. **UI 모드**: `npx playwright test --ui`로 실시간 디버깅
5. **특정 테스트만 실행**: `npx playwright test tests/tms/auth/login.spec.js`
6. **태그별 실행**: `npx playwright test --grep @smoke`

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

---

**포트폴리오 프로젝트**: TMS_v2 E2E 테스트 자동화  
**테스트 대상**: https://tms-v2-phi.vercel.app/  
**테스트 프레임워크**: Playwright