# App 테스트

Eterno App 플랫폼의 자동화 테스트입니다.

## 테스트 구조

- `auth/` - 앱 인증 테스트
- `wallet/` - 앱 지갑 테스트
- `nft/` - NFT 관련 테스트
- `social/` - 소셜 기능 테스트

## 실행 방법

```bash
# App 전체 테스트
npx playwright test tests/app/

# 특정 기능 테스트
npx playwright test tests/app/auth/
npx playwright test tests/app/wallet/
```

