## 📌 Project — TMS_v2 (Task Management System)
**기간:** 약 1주일

**역할:** 기획 · 프롬프트 기반 개발 · 테스트 및 개선 전 과정  

**GitHub:** https://github.com/koesnuj/portfolio/tree/main/projects/TMS_v2

### 🔍 Overview
비전공자 상태에서 AI 개발 도구만을 사용하여  
회원 관리, 프로젝트 관리, 업무(Task) 관리가 가능한 **웹 기반 TMS 시스템**을 처음부터 끝까지 완성한 프로젝트입니다.

### 🔧 Key Features
- 회원가입, 로그인(JWT 기반)
- 프로젝트 CRUD 기능
- 업무(Task) 생성, 상태 변경, 상세 조회
- 사용자 권한(Role) 기반 접근 제어
- 사용자 흐름에 맞춘 화면 설계 및 데이터 시나리오 제작

### 🚀 Development Approach
- 단순 기능은 프롬프트 기반 자동 구현  
- 복잡한 기능은 **기능 간 흐름·화면 요구사항을 매우 구체적으로 기술**하여 구현 정확도 향상  
- 구조(DB/API)를 직접 설계하진 못했지만, 기능이 어떤 데이터를 필요로 하는지 명확히 정의하여 시스템 완성도 확보  
- AI가 맥락을 잃거나 기존 기능을 변경할 경우 **흐름 재정립 및 원인 추적**으로 해결  
- QA 경험을 활용해 테스트·디버깅의 정확도 향상

### 🌱 What I Learned
- **AI는 만능 개발자가 아니다. 설계가 명확해야 원하는 결과가 나온다.**  
- 기능을 정확히 이해하고 설명하는 능력이 곧 개발의 품질을 결정한다.  
- 흐름 설계와 논리적 문제 해결 능력만으로도 실제 서비스 개발이 가능하다.  
- AI를 효율적으로 활용하면 비전공자도 충분히 복잡한 시스템을 구현할 수 있다.

### 📚 Additional Experience
- 기능 요구사항 문서 작성 및 화면 정의서 작성 경험
- 다양한 기능 흐름을 테스트하고 개선한 품질 관리 경험
- 개인 프로젝트에서 AI 기반 반복 개발 프로세스 구축

---

# ORCA

테스트 케이스 관리 시스템

---

## 주요 기능

### 테스트 케이스 관리
- 폴더 구조로 테스트 케이스 분류
- 드래그 앤 드롭으로 이동
- Rich Text Editor 지원

### 테스트 실행 계획(Plan)
- 테스트 선택 및 Plan 생성
- 담당자 할당
- 실행 결과 기록

### 진행률 시각화
- 도넛 차트 및 프로그레스 바
- Pass/Fail/Block 상태 표시

### CSV 지원
- CSV 파일 업로드/다운로드

### 권한 관리
- 관리자 승인 시스템
- 역할 기반 접근 제어

---

## 설치

### 백엔드
```bash
cd backend
npm install
cp env.example .env
# .env 파일 설정 필요
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

실행 주소: `http://localhost:3001`

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```

실행 주소: `http://localhost:5173`

---

## 사용법

1. 회원가입 및 관리자 승인 (첫 사용자는 자동 관리자 지정)
2. 로그인
3. 폴더 생성 및 테스트 케이스 작성
4. Plan 생성 및 테스트 실행

---

## 기술 스택

### 백엔드
- Electron 30 (Express + TypeScript)
- Prisma (SQLite)
- JWT

### 프론트엔드
- React 18 (TypeScript)
- Vite
- Tailwind CSS
- Tiptap
- @dnd-kit

---

## 프로젝트 구조
```
TMS_v2/
├── backend/          # Express API 서버
└── frontend/         # React 프론트엔드
```

## 라이선스

MIT License
