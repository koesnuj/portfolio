# Hub (Eterno) 테스트

Eterno Hub 플랫폼의 자동화 테스트입니다.

## 테스트 구조

- `avatar(2d)/` - 아바타 생성 테스트
- `group-treasury/` - 그룹 트레저리 테스트  
- `payout/` - 지급 테스트
- `signup/` - 회원가입 테스트
- `wallet/` - 지갑 테스트

## 실행 방법

```bash
# Hub 전체 테스트
npx playwright test tests/hub/

# 특정 기능 테스트
npx playwright test tests/hub/signup/
npx playwright test tests/hub/wallet/
```

