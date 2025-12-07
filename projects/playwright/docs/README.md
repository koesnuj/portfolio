# 📊 TMS_v2 E2E 테스트 리포트

이 폴더에는 Playwright E2E 테스트의 샘플 결과물이 포함되어 있습니다.

## 📁 폴더 구조

```
docs/
├── reports/              # HTML 테스트 리포트
│   ├── index.html       # 메인 리포트 (브라우저로 열기)
│   └── data/            # 테스트 데이터 (스크린샷, 영상)
├── screenshots/         # 주요 테스트 결과 스크린샷
│   └── e2e-test-result.png
└── README.md           # 이 파일
```

## 🎯 리포트 보기

### 방법 1: HTML 리포트 열기

브라우저에서 다음 파일을 직접 여세요:

```
docs/reports/index.html
```

**리포트에서 확인 가능한 정보:**
- ✅ 테스트 성공/실패 결과
- 📸 각 단계별 스크린샷
- 📹 전체 테스트 실행 영상
- ⏱️ 테스트 실행 시간
- 🔍 상세 로그 및 에러 정보

### 방법 2: GitHub Pages로 호스팅 (선택사항)

GitHub Pages를 활성화하면 웹에서 바로 볼 수 있습니다:

1. GitHub 저장소 → Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` → `/docs` 폴더 선택
4. Save

그러면 다음 URL로 리포트에 접근할 수 있습니다:
```
https://[username].github.io/[repository]/projects/playwright/docs/reports/
```

## 📸 테스트 결과 스크린샷

### E2E 테스트 완료 화면

![E2E Test Result](./screenshots/e2e-test-result.png)

이 스크린샷은 전체 E2E 플로우가 성공적으로 완료된 화면입니다.

## 🎬 테스트 시나리오

리포트에 포함된 테스트:

1. **로그인** - TMS_v2 자동 로그인
2. **Test Cases 이동** - 좌측 메뉴 네비게이션
3. **Add case** - 새 테스트케이스 생성 버튼
4. **정보 입력** - Title, Precondition, Steps, Expected Result
5. **저장** - Save 및 성공 확인

각 단계의 스크린샷과 영상이 리포트에 포함되어 있습니다.

## 🔄 새 리포트 생성

최신 테스트 결과로 리포트를 업데이트하려면:

```bash
# 테스트 실행
cd projects/playwright
npm test

# 리포트 복사
xcopy playwright-report docs\reports /E /I /Y

# 스크린샷 복사
Get-ChildItem -Path "test-results\*chromium\test-finished-1.png" -Recurse | Copy-Item -Destination "docs\screenshots\e2e-test-result.png"
```

## 📝 참고 사항

- 리포트는 정적 HTML 파일이므로 별도 서버 없이 브라우저에서 바로 볼 수 있습니다
- 영상과 스크린샷은 `data/` 폴더에 포함되어 있습니다
- 파일 크기가 클 수 있으므로 Git LFS 사용을 권장합니다

---

**테스트 대상**: https://tms-v2-phi.vercel.app/  
**테스트 프레임워크**: Playwright

