# 🎬 TMS_v2 E2E 테스트 가이드

## 📹 영상 녹화 테스트: 로그인 → 테스트케이스 생성

### 🎯 테스트 시나리오

1. **로그인**
   - 로그인 페이지 접속
   - 이메일/비밀번호 입력
   - 로그인 버튼 클릭
   
2. **Test Cases 페이지 이동**
   - 좌측 네비게이션에서 "Test Cases" 클릭

3. **새 테스트케이스 생성**
   - "Add case" 버튼 클릭
   - Title, Precondition, Steps, Expected Result 입력
   
4. **저장 및 확인**
   - "Save" 버튼 클릭
   - 성공 메시지 확인

---

## 🚀 테스트 실행 방법

### 1. E2E 전체 플로우 테스트 실행 (영상 녹화 포함)

```bash
# 전체 E2E 테스트
npx playwright test tests/tms/e2e/full-flow.spec.js

# 헤드 모드로 실행 (브라우저 보면서)
npx playwright test tests/tms/e2e/full-flow.spec.js --headed

# 특정 테스트만 실행
npx playwright test tests/tms/e2e/full-flow.spec.js -g "전체 플로우"

# 디버그 모드
npx playwright test tests/tms/e2e/full-flow.spec.js --debug
```

### 2. UI 모드로 실행 (추천)

```bash
npx playwright test --ui
```

UI 모드에서:
1. `tests/tms/e2e/full-flow.spec.js` 선택
2. "전체 플로우" 테스트 클릭
3. 실시간으로 테스트 진행 확인

---

## 📹 영상 확인 방법

### 영상 저장 위치

테스트 실행 후 영상은 다음 위치에 저장됩니다:

```
test-results/
  └── [테스트명]-[브라우저]/
      └── video.webm
```

예시:
```
test-results/
  └── tms-e2e-full-flow-chromium/
      └── video.webm
```

### 영상 재생

1. **Windows**: 
   - VLC Player 또는 Chrome 브라우저로 열기
   - 탐색기에서 더블클릭

2. **브라우저에서 직접 재생**:
   ```bash
   # Chrome에서 열기
   start chrome test-results/[폴더명]/video.webm
   ```

---

## 🎥 녹화 설정

현재 설정 (`playwright.config.js`):

```javascript
video: 'on',        // 모든 테스트 녹화
screenshot: 'on',   // 모든 액션 스크린샷
slowMo: 1000,      // 각 액션 사이 1초 대기 (영상 확인용)
```

### 녹화 설정 변경

**더 빠르게 테스트하려면** (`playwright.config.js`):
```javascript
slowMo: 500,  // 0.5초 대기
```

**녹화만 필요한 테스트만** (`playwright.config.js`):
```javascript
video: 'retain-on-failure',  // 실패한 테스트만 녹화
```

---

## 🔍 테스트 상세 로그

테스트 실행 중 콘솔에 다음과 같은 로그가 출력됩니다:

```
🎬 E2E 테스트 시작: 로그인부터 테스트케이스 생성까지
📹 영상 녹화 중...

📍 STEP 1: 로그인 페이지 접속
📧 이메일 입력: test1@tms.com
🔒 비밀번호 입력
🔘 로그인 버튼 클릭
✅ STEP 1 완료: 로그인 성공!

📍 STEP 2: 테스트케이스 페이지로 이동
✅ STEP 2 완료: 테스트케이스 페이지 진입

📍 STEP 3: 새 테스트케이스 생성 버튼 클릭
✓ 생성 버튼 찾음: button:has-text("생성")
✅ STEP 3 완료: 생성 버튼 클릭

📍 STEP 4: 테스트케이스 정보 입력
📝 제목 입력: 자동 테스트 케이스 1733...
📝 설명 입력 완료
🎯 우선순위: HIGH 선택

📍 STEP 5: 저장 버튼 클릭
✓ 저장 버튼 찾음: button:has-text("저장")
✅ STEP 5 완료: 저장 버튼 클릭
🎉 성공 메시지 확인됨

🎬 E2E 테스트 완료!
📹 영상은 test-results 폴더에 저장됩니다.
```

---

## 🐛 문제 해결

### 로그인 실패

- 계정 정보 확인: `config/test-config.js`
- TMS_v2 사이트에 해당 계정이 있는지 확인

### 요소를 찾을 수 없음

- 사이트 구조가 변경되었을 수 있습니다
- `--headed` 모드로 실행하여 화면 확인
- 필요시 셀렉터 업데이트

### 영상이 저장되지 않음

- `playwright.config.js`의 `video: 'on'` 설정 확인
- `test-results` 폴더 권한 확인

---

## 📊 리포트 확인

테스트 완료 후:

```bash
# HTML 리포트 열기
npx playwright show-report
```

리포트에서:
- ✅ 성공/실패 결과
- 📸 각 단계별 스크린샷
- 📹 영상 링크
- ⏱️ 실행 시간
- 🔍 상세 로그

---

## 🎯 추가 테스트 시나리오

### 빠른 로그인 테스트만

```bash
npx playwright test tests/tms/e2e/full-flow.spec.js -g "로그인만"
```

### 모든 E2E 테스트

```bash
npx playwright test tests/tms/e2e/
```

---

## 💡 팁

1. **UI 모드 활용**: 실시간으로 테스트 진행 상황 확인
2. **slowMo 조절**: 영상 촬영용은 1000ms, 일반 테스트는 500ms
3. **디버그 모드**: 문제 발생 시 `--debug` 옵션으로 단계별 실행
4. **태그 활용**: `@e2e`, `@video` 태그로 필터링 가능

```bash
# E2E 태그가 있는 테스트만
npx playwright test --grep @e2e

# 영상 녹화 필요한 테스트만
npx playwright test --grep @video
```

---

**테스트 대상**: https://tms-v2-phi.vercel.app/  
**계정 설정**: `config/test-config.js`에서 관리

