# Eterno Hub, Studio, App Playwright 자동화 프로젝트

## 📁 프로젝트 구조

```
my-playwright-project/
├── tests/
│   ├── hub/                           # Eterno Hub 테스트
│   │   ├── avatar(2d)/               # 아바타 생성 테스트
│   │   ├── group-treasury/           # 그룹 트레저리 테스트
│   │   ├── payout/                   # 지급 테스트
│   │   ├── signup/                   # 회원가입 테스트
│   │   ├── wallet/                   # 지갑 테스트
│   │   └── README.md
│   ├── studio/                        # Studio 테스트 (예정)
│   │   ├── auth/                     # 인증 테스트
│   │   ├── project/                  # 프로젝트 관리 테스트
│   │   ├── asset/                    # 에셋 관리 테스트
│   │   ├── render/                   # 렌더링 테스트
│   │   └── README.md
│   └── app/                           # App 테스트 (예정)
│       ├── auth/                     # 앱 인증 테스트
│       ├── wallet/                   # 앱 지갑 테스트
│       ├── nft/                      # NFT 관련 테스트
│       ├── social/                   # 소셜 기능 테스트
│       └── README.md
├── utils/
│   ├── auth-helper.js                # 공통 로그인 모듈
│   ├── report-helper.js              # 리포트 관리 모듈
│   └── signup-helper.js              # 회원가입 헬퍼
├── config/
│   └── test-config.js               # 테스트 설정
├── scripts/
│   ├── cleanup-backups.js           # 백업 정리
│   ├── report.js                     # 리포트 관리
│   ├── run-all-tests.js             # 전체 테스트 실행
│   ├── run-test.js                  # 개별 테스트 실행
│   └── run-platform-test.js         # 플랫폼별 테스트 실행
├── playwright-report-backups/        # 백업된 리포트들
├── test-results/                     # 테스트 결과 (스크린샷, 비디오)
├── screenshots/                      # 스크린샷 모음
├── package.json                      # 프로젝트 설정
├── playwright.config.js             # Playwright 설정
├── scheduler.js                      # 수동 테스트 실행 + 자동 백업
├── test-all-backup-scheduler.js     # 전체 테스트 + 백업 + HTML 열기
├── backup-report.js                  # 리포트 백업만
└── README.md                         # 프로젝트 문서
```

## 🚀 빠른 시작

### 1. 필수 설치
```bash
# Node.js 설치 (최신 LTS 버전)
# https://nodejs.org 에서 다운로드

# Git 설치 (코드 다운로드용)
# https://git-scm.com 에서 다운로드
```

### 2. 프로젝트 다운로드
```bash
# GitHub에서 클론
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

# 의존성 설치
npm install
```

### 3. 브라우저 설치
```bash
# Playwright 브라우저 설치
npm run install-browsers
```

## 🎯 테스트 실행 가이드

### **플랫폼별 테스트 실행**

#### **Hub 테스트**
```bash
# 기본 실행 (QA 환경)
npm run test:hub
npm run playwright:hub

# 개발 환경
npm run test:hub:dev
npm run playwright:hub:dev

# Release-QA 환경
npm run test:hub:release-qa
npm run playwright:hub:release-qa

# 디버그 모드
npm run test:hub:debug
npm run test:hub:debug:release-qa
```

#### **Studio 테스트 (예정)**
```bash
# 기본 실행 (QA 환경)
npm run test:studio
npm run playwright:studio

# Release-QA 환경
npm run test:studio:release-qa
npm run playwright:studio:release-qa
```

#### **App 테스트 (예정)**
```bash
# 기본 실행 (QA 환경)
npm run test:app
npm run playwright:app

# Release-QA 환경
npm run test:app:release-qa
npm run playwright:app:release-qa
```

### **전체 테스트 실행 (기존 방식)**
```bash
# 모든 플랫폼 테스트 (기본)
npm run test                # qa 환경
npm run test:dev            # dev 환경
npm run test:release-qa     # release-qa 환경

# Playwright UI
npm run playwright          # qa 환경
npm run playwright:dev      # dev 환경
npm run playwright:release-qa # release-qa 환경
```

### **환경별 URL**

| 환경 | 명령어 | Hub URL | Studio URL | App URL |
|------|--------|---------|------------|---------|
| **qa** (기본) | `npm run test:hub` | `https://eterno-qa.ovdr.io` | `https://studio-qa.ovdr.io` | `https://app-qa.ovdr.io` |
| **dev** | `npm run test:hub:dev` | `https://eterno-dev.ovdr.io` | `https://studio-dev.ovdr.io` | `https://app-dev.ovdr.io` |
| **release-qa** | `npm run test:hub:release-qa` | `https://eterno-release-qa.overdare.com` | `https://studio-release-qa.overdare.com` | `https://app-release-qa.overdare.com` |

### **사용 시나리오**

#### **1. Hub 개발 중 테스트 (qa 환경)**
```bash
npm run playwright:hub
```

#### **2. Hub 릴리즈 전 테스트 (release-qa 환경)**
```bash
npm run playwright:hub:release-qa
```

#### **3. Studio 개발 중 테스트 (qa 환경)**
```bash
npm run playwright:studio
```

#### **4. App 릴리즈 전 테스트 (release-qa 환경)**
```bash
npm run playwright:app:release-qa
```

## 📊 백업 시스템

### **자동 백업**
- 모든 테스트 실행 후 자동으로 `playwright-report-backups` 폴더에 백업
- 날짜별, 플랫폼별로 구분하여 저장
- 원본 리포트는 다음 테스트를 위해 자동 삭제

### **백업 폴더 구조**
```
playwright-report-backups/
├── backup_2025-09-18_1/              # Hub 테스트 백업
├── backup_2025-09-18_2/              # Studio 테스트 백업
├── backup_2025-09-18_3/              # App 테스트 백업
└── ...
```

### **수동 백업**
```bash
npm run backup-report                 # 수동 백업만
npm run cleanup-backups               # 빈 백업 폴더 정리
```

## 🎯 테스트 종류

### **Hub 테스트 (Eterno)**
- **아바타 생성**: 7단계 자동화 테스트
- **회원가입**: 구글 OAuth 로그인 테스트
- **지갑 연결**: OVERDARE Wallet 연결 테스트
- **그룹 트레저리**: 정산 기능 테스트
- **지급**: 수익 분배 테스트

### **Studio 테스트 (예정)**
- **인증**: Studio 로그인 테스트
- **프로젝트 관리**: 프로젝트 생성/편집 테스트
- **에셋 관리**: 에셋 업로드/관리 테스트
- **렌더링**: 렌더링 기능 테스트

### **App 테스트 (Overdare 모바일 앱)**
- **앱 인증**: 모바일 앱 로그인 테스트
- **앱 지갑**: 모바일 지갑 기능 테스트
- **NFT**: NFT 관련 기능 테스트
- **소셜**: 소셜 기능 테스트
- **회원가입 자동화**: 게스트 회원가입 플로우 테스트

## 🎯 테스트 태그 시스템

### **Hub 아바타 생성 테스트 태그 (Eterno)**
- `@step1`: 로그인 및 쿠키 동의
- `@step2`: Create 페이지 이동 및 Avatar Item 선택
- `@step3`: Skintight Mask 템플릿 선택
- `@step4`: PNG 파일 업로드
- `@step5`: 아이템 정보 입력
- `@step6`: 동의 체크박스 및 Complete
- `@final-step`: 아바타 삭제 테스트

### **Hub 회원가입 테스트 태그 (Eterno)**
- `@step1`: 회원가입 페이지 이동
- `@step2`: 구글 OAuth 로그인
- `@step3`: 프로필 설정
- `@final-step`: 회원가입 완료

### **Hub 지갑 테스트 태그 (Eterno)**
- `@step1`: 지갑 페이지 이동
- `@step2`: 지갑 정보 확인
- `@final-step`: 지갑 테스트 완료

### **Overdare 앱 회원가입 테스트 태그**
- `@step1`: 앱 실행 및 연결
- `@step2`: 잠금 해제 (필요시)
- `@step3`: QA 서버 선택
- `@step4`: GO 버튼 클릭
- `@step5`: START 버튼 클릭 (게스트 회원가입)
- `@step6`: 나이 슬라이더 조작
- `@step7`: OK 버튼 클릭
- `@step8`: 알림 설정 화면 도달
- `@final-step`: 회원가입 완료

## 🔧 공통 모듈 사용법

### **새로운 테스트 파일 만들기**
```javascript
const { test, expect } = require('@playwright/test');
const { loginAndHandleCookies } = require('../../utils/auth-helper');

test('새로운 기능 테스트 @step1', async ({ page }) => {
  // 로그인 + 쿠키 동의 (한 줄로!)
  await loginAndHandleCookies(page);
  
  // 여기에 새로운 기능 테스트 코드 작성
  await page.goto('https://eterno-qa.ovdr.io/your-page');
  // ...
});
```

### **사용 가능한 함수들**
```javascript
const { 
  loginToEterno,           // 로그인만
  handleCookieConsent,     // 쿠키 동의만
  loginAndHandleCookies    // 로그인 + 쿠키 동의 (권장)
} = require('../../utils/auth-helper');
```

## 📋 주요 기능

### ✅ 완료된 자동화
- **로그인**: Dev Bypass 자동 로그인 (test111/test111)
- **쿠키 동의**: 팝업 자동 처리
- **아바타 생성**: Create → Avatar Item → Skintight Mask 선택
- **파일 업로드**: PNG 파일 자동 업로드
- **경고 팝업 처리**: "Oops! An unknown error" 팝업 자동 처리
- **무작위 이름 생성**: 중복 방지를 위한 6자리 랜덤 이름
- **단계별 테스트**: 각 단계를 독립적으로 테스트 가능
- **자동 백업**: 테스트 완료 후 자동 백업
- **플랫폼별 테스트**: Hub, Studio, App 분리된 테스트 구조
- **Overdare 앱 회원가입**: 게스트 회원가입 플로우 자동화 (86% 성공률)

### 🔄 진행 중인 기능
- Studio 테스트 구현
- App 테스트 구현
- 프로필 설정
- 대시보드 테스트
- 설정 페이지 테스트

## 🔍 Overdare 앱 자동화 검증 케이스

### **중요한 검증 포인트**

#### **케이스 1: 이미 로그인된 상태에서 GO 버튼 클릭**
- **시나리오**: 앱이 이미 로그인된 상태에서 GO 버튼을 누르고 홈으로 진입
- **예상 결과**: 이미 로그인되어 있는 계정이므로 통과 (성공)
- **검증 방법**: 
  - START 버튼이 나타나지 않음
  - 홈 화면으로 바로 이동
  - 회원가입 플로우를 건너뜀
- **테스트 명령어**: `node signup-from-running-app.js`

#### **케이스 2: 완전히 초기화된 상태에서 회원가입**
- **시나리오**: 앱을 완전히 초기화하고 처음부터 회원가입 진행
- **예상 결과**: 모든 회원가입 단계가 순차적으로 진행
- **검증 방법**:
  - START 버튼이 나타남
  - 슬라이더 조작 가능
  - OK 버튼 클릭 가능
  - 알림 설정 화면 도달
- **테스트 명령어**: `node reset-and-signup-from-scratch.js`

#### **케이스 3: 홈 화면에서 앱 찾기 및 실행**
- **시나리오**: Android 홈 화면에서 Overdare 앱을 찾아 실행
- **예상 결과**: 앱 아이콘을 찾아 성공적으로 실행
- **검증 방법**:
  - 홈 화면에서 앱 아이콘 발견
  - 앱 드로어에서 앱 찾기
  - 앱 실행 성공
- **테스트 명령어**: `node find-and-run-overdare-from-home.js`

### **리포트 확인**
- **HTML 리포트**: `overdare-signup-from-running-app-report.html` (최고 성공률 86%)
- **스크린샷**: `screenshots/` 폴더에 단계별 스크린샷 저장
- **실행 로그**: 터미널에서 실시간 진행 상황 확인

### **중요한 주의사항**
- **앱 종료**: 모든 테스트 케이스 완료 후 반드시 앱을 백그라운드로 보내고 강제 종료
- **3초 대기**: 백그라운드 전송 후 3초 대기하여 앱이 완전히 종료되도록 보장
- **디바이스 정리**: 테스트 후 디바이스에서 앱이 완전히 제거되어 다음 테스트 준비

## 🛠️ 개발 팁

1. **새로운 테스트 만들 때**: `loginAndHandleCookies(page)` 한 줄만 추가
2. **로그인 로직 변경 시**: `utils/auth-helper.js`만 수정
3. **디버깅**: `--headed` 또는 `--debug` 옵션 사용
4. **타임아웃**: `test.setTimeout(120000)` 설정 (2분)
5. **단계별 테스트**: 특정 단계만 실행하여 디버깅 효율성 향상
6. **경고 팝업**: 자동으로 처리되므로 수동 개입 불필요
7. **백업 관리**: 자동 백업으로 리포트 손실 방지
8. **플랫폼별 테스트**: 각 플랫폼을 독립적으로 테스트 가능
9. **환경별 테스트**: QA, Dev, Release-QA 환경별 테스트 가능
10. **Overdare 앱 테스트**: Appium을 사용한 모바일 앱 자동화
11. **앱 상태 검증**: 이미 로그인된 상태와 초기화된 상태 구분 중요
12. **앱 종료 필수**: 모든 테스트 후 백그라운드 전송 → 3초 대기 → 강제 종료

## 📝 주의사항

- 브라우저 자동화 중에는 수동 조작을 피하세요
- PNG 파일 경로가 올바른지 확인하세요: `C:\Users\cmiron\Desktop\imagemaker\512x512.png`
- 에셋 등록 개수 초과를 방지하기 위해 개별 단계별로 테스트하세요

## 💻 다른 PC에서 실행하기

### **필수 요구사항**
- **Node.js**: 최신 LTS 버전 (18.x 이상)
- **Git**: 코드 다운로드용
- **인터넷 연결**: 패키지 설치 및 테스트 실행용

### **설치 순서**
1. **Node.js 설치**: https://nodejs.org
2. **Git 설치**: https://git-scm.com
3. **프로젝트 클론**: `git clone [저장소URL]`
4. **의존성 설치**: `npm install`
5. **브라우저 설치**: `npm run install-browsers` ⚠️ **필수!**

### **테스트 실행**
```bash
# 첫 테스트 실행 (Hub)
npm run test:hub

# Studio 테스트 (예정)
npm run test:studio

# App 테스트 (예정)
npm run test:app
```

## 🏢 회사 GitHub Enterprise 사용법

### **회사 동료들이 사용하는 방법**

#### **1. 저장소 클론**
```bash
# 회사 GitHub에서 클론
git clone https://github.krafton.com/sbx/qa-automation.git
cd qa-automation

# playwright 브랜치로 체크아웃
git checkout playwright
```

#### **2. 설치 및 실행**
```bash
# 의존성 설치
npm install

# 브라우저 설치 (필수!)
npm run install-browsers

# 테스트 실행
npm run test:hub:release-qa
```

#### **3. 환경별 테스트**
```bash
# QA 환경
npm run test:hub:qa
npm run playwright:hub:qa

# Dev 환경
npm run test:hub:dev
npm run playwright:hub:dev

# Release-QA 환경
npm run test:hub:release-qa
npm run playwright:hub:release-qa
```

### **개발자 가이드**
- **계정 정보**: `config/test-config.js`에 하드코딩되어 있음
- **환경 변수**: 설정 불필요 (즉시 사용 가능)
- **브라우저**: 반드시 `npm run install-browsers` 실행 필요

## 🎉 최신 업데이트

### v5.0.0 (2025년 9월 18일)
- ✅ 플랫폼별 테스트 구조 도입 (Hub, Studio, App)
- ✅ 환경별 플랫폼 테스트 실행 명령어 추가
- ✅ Playwright UI 플랫폼별 실행 지원
- ✅ 디버그 모드 플랫폼별 실행 지원
- ✅ 자동 백업 시스템 개선
- ✅ 테스트 폴더 구조 정리 및 문서화

### v4.1.0 (2025년 9월 11일)
- ✅ 백그라운드 스케줄러 실행 지원 (nohup 사용)
- ✅ 컴퓨터 락/모니터 꺼짐과 무관한 스케줄러 실행
- ✅ 테스트용 스케줄러 추가 (낮 12시 15분)
- ✅ 프로세스 관리 명령어 가이드 추가
- ✅ 스케줄러 로그 관리 시스템
- ✅ PID 기반 프로세스 제어

### v4.0.0 (2025년 9월 11일)
- ✅ 단계별 태그 시스템 도입 (@step1, @step2, @final-step 등)
- ✅ 자동 백업 시스템 구축 (backup_YYYY-MM-DD_Step_N 형식)
- ✅ 스케줄러 시스템 구축 (매일 오전 9시 자동 실행)
- ✅ 개별 스텝 테스트 + 백업 기능
- ✅ 전체 테스트 + 백업 기능
- ✅ HTML 리포트 자동 열기/안열기 옵션
- ✅ 백업 폴더 자동 정리 기능
- ✅ 프로세스 자동 종료 기능
- ✅ 테스트 타입별 백업 폴더명 구분

---

**마지막 업데이트**: 2025년 9월 18일  
**버전**: 5.0.0