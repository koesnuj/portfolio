const { test, expect } = require('@playwright/test');
const { loginToTMS, logoutFromTMS } = require('../../../utils/auth-helper');
const config = require('../../../config/test-config');

test.describe('TMS_v2 로그인 테스트', () => {
  
  test('로그인 페이지 접속 @smoke', async ({ page }) => {
    await page.goto(config.urls.login());
    await page.waitForLoadState('networkidle');
    
    // 로그인 페이지 요소 확인
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("로그인"), button:has-text("Login")')).toBeVisible();
    
    console.log('✅ 로그인 페이지 정상 로드');
  });

  test('정상 로그인 테스트 @critical', async ({ page }) => {
    await loginToTMS(page);
    
    // 대시보드 페이지 확인
    await expect(page).toHaveURL(/.*dashboard/);
    console.log('✅ 대시보드 페이지 진입 확인');
  });

  test('로그인 후 로그아웃 테스트', async ({ page }) => {
    // 로그인
    await loginToTMS(page);
    
    // 로그아웃
    await logoutFromTMS(page);
    
    // 로그인 페이지로 리다이렉트 확인
    await expect(page).toHaveURL(/.*login/);
    console.log('✅ 로그아웃 성공');
  });

  test('잘못된 이메일로 로그인 실패 테스트', async ({ page }) => {
    await page.goto(config.urls.login());
    
    // 잘못된 이메일 입력
    await page.locator('input[type="email"]').fill('wrong@test.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.locator('button:has-text("로그인"), button:has-text("Login")').first().click();
    
    // 에러 메시지 확인 (실제 에러 메시지에 맞게 조정 필요)
    await page.waitForTimeout(2000);
    
    console.log('✅ 잘못된 로그인 시도 테스트 완료');
  });

  test('빈 필드로 로그인 시도 테스트', async ({ page }) => {
    await page.goto(config.urls.login());
    
    // 빈 필드로 로그인 버튼 클릭
    await page.locator('button:has-text("로그인"), button:has-text("Login")').first().click();
    
    // 여전히 로그인 페이지에 있는지 확인
    await expect(page).toHaveURL(/.*login/);
    
    console.log('✅ 빈 필드 검증 테스트 완료');
  });
});

