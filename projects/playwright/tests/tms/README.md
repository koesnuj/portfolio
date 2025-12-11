# TMS_v2 E2E 테스트

## 📋 테스트 구조

```
tests/tms/
└── e2e/                    # E2E 전체 플로우 테스트
    ├── create-case-flow.spec.js   # 로그인부터 테스트케이스 생성까지 전체 플로우
    └── create-plan-flow.spec.js   # 로그인부터 플랜 생성까지 전체 플로우
```

## 🎯 테스트 태그

- `@e2e` - End-to-End 전체 플로우 테스트
- `@video` - 영상 녹화 필요 테스트

## 🚀 실행 방법

```bash
# E2E 전체 플로우 테스트 실행
npx playwright test tests/tms/e2e/create-case-flow.spec.js
npx playwright test tests/tms/e2e/create-plan-flow.spec.js

# 헤드 모드로 실행 (브라우저 보면서)
npx playwright test tests/tms/e2e/create-case-flow.spec.js --headed
npx playwright test tests/tms/e2e/create-plan-flow.spec.js --headed

# 디버그 모드
npx playwright test tests/tms/e2e/create-case-flow.spec.js --debug
npx playwright test tests/tms/e2e/create-plan-flow.spec.js --debug

# UI 모드로 실행 (추천)
npx playwright test --ui

# 태그별 실행
npx playwright test --grep @e2e
npx playwright test --grep @video
```

## 📝 테스트 시나리오

### 플로우 1: 로그인 → 테스트케이스 생성 (create-case-flow.spec.js)
- ✅ **STEP 1**: 로그인 페이지 접속 및 로그인
- ✅ **STEP 2**: Test Cases 페이지로 이동
- ✅ **STEP 3**: "Add case" 버튼 클릭
- ✅ **STEP 4**: 테스트케이스 정보 입력 (Title, Precondition, Steps, Expected Result)
- ✅ **STEP 5**: Save 버튼 클릭 및 저장 확인

### 플로우 2: 로그인 → 플랜 생성 (create-plan-flow.spec.js)
- ✅ **STEP 1**: 로그인 페이지 접속 및 로그인
- ✅ **STEP 2**: Test Plans & Runs 페이지로 이동
- ✅ **STEP 3**: "플랜 생성" 버튼 클릭 및 플랜 생성 페이지 진입
- ✅ **STEP 4**: 플랜 이름 입력
- ✅ **STEP 5**: 설명 입력 (선택사항)
- ✅ **STEP 6**: 테스트케이스 선택 (목록에서 일부 선택)
- ✅ **STEP 7**: 플랜 생성 버튼 클릭 및 플랜 목록 페이지로 이동 확인
- ✅ **STEP 8**: 활성 플랜 목록에서 생성한 플랜 클릭하여 상세 페이지 진입

## ⚙️ 설정

테스트 계정 및 URL은 `config/test-config.js`에서 관리됩니다.

```javascript
// 테스트 계정
testAccount: {
  email: 'test@test.com',
  password: 'test1234',
  username: 'Test User'
}

// 테스트 데이터
testData: {
  plan: {
    name: 'test',
    description: 'description'
  }
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

## 📹 영상 확인

테스트 실행 중 영상이 자동으로 녹화됩니다:

```
test-results/
  └── [테스트명]-[브라우저]/
      └── video.webm
```

영상은 VLC Player 또는 Chrome 브라우저로 재생할 수 있습니다.
