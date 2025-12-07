# TMS_v2 E2E 테스트

## 📋 테스트 구조

```
tests/tms/
├── auth/                    # 인증 관련 테스트
│   └── login.spec.js       # 로그인/로그아웃 테스트
├── testcase/               # 테스트케이스 관리
│   └── testcase-crud.spec.js  # CRUD 테스트
├── plan/                   # 테스트 플랜 관리
│   └── plan-management.spec.js  # 플랜 관리 테스트
└── dashboard/              # 대시보드
    └── dashboard.spec.js   # 대시보드 테스트
```

## 🎯 테스트 태그

- `@smoke` - 기본 동작 확인 테스트
- `@critical` - 핵심 기능 테스트
- `@regression` - 회귀 테스트

## 🚀 실행 방법

```bash
# 전체 테스트 실행
npm test

# 특정 폴더만 실행
npx playwright test tests/tms/auth
npx playwright test tests/tms/testcase
npx playwright test tests/tms/plan
npx playwright test tests/tms/dashboard

# 태그별 실행
npx playwright test --grep @smoke
npx playwright test --grep @critical

# UI 모드로 실행
npx playwright test --ui

# 특정 테스트 파일만 실행
npx playwright test tests/tms/auth/login.spec.js
```

## 📝 테스트 시나리오

### 인증 (auth)
- ✅ 로그인 페이지 접속
- ✅ 정상 로그인
- ✅ 로그아웃
- ✅ 잘못된 계정으로 로그인 실패
- ✅ 빈 필드 검증

### 테스트케이스 (testcase)
- ✅ 테스트케이스 페이지 접속
- ✅ 새 테스트케이스 생성
- ✅ 테스트케이스 목록 조회
- ✅ 폴더 구조 확인

### 테스트 플랜 (plan)
- ✅ 플랜 페이지 접속
- ✅ 새 플랜 생성
- ✅ 플랜 목록 조회
- ✅ 플랜 상세 페이지 접근

### 대시보드 (dashboard)
- ✅ 대시보드 접속
- ✅ 통계 위젯 확인
- ✅ 네비게이션 메뉴 확인
- ✅ 페이지 간 이동

## ⚙️ 설정

테스트 계정 및 URL은 `config/test-config.js`에서 관리됩니다.

```javascript
testAccount: {
  email: 'test@test.com',
  password: 'test1234',
  username: 'Test User'
}
```

## 📊 리포트

테스트 실행 후 리포트를 확인할 수 있습니다:

```bash
npx playwright show-report
```

리포트 위치:
- HTML 리포트: `playwright-report/index.html`
- 스크린샷/비디오: `test-results/`

