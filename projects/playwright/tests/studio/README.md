# Studio 테스트

Eterno Studio 플랫폼의 자동화 테스트입니다.

## 테스트 구조

- `auth/` - 인증 관련 테스트
- `project/` - 프로젝트 관리 테스트
- `asset/` - 에셋 관리 테스트
- `render/` - 렌더링 테스트

## 실행 방법

```bash
# Studio 전체 테스트
npx playwright test tests/studio/

# 특정 기능 테스트
npx playwright test tests/studio/auth/
npx playwright test tests/studio/project/
```

