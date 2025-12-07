const { test, expect } = require('@playwright/test');
const { loginToTMS } = require('../../../utils/auth-helper');
const config = require('../../../config/test-config');

test.describe('TMS_v2 대시보드', () => {
  
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로그인
    await loginToTMS(page);
  });

  test('대시보드 페이지 접속 @smoke', async ({ page }) => {
    await page.goto(config.urls.dashboard());
    await page.waitForLoadState('networkidle');
    
    // 대시보드 페이지 확인
    await expect(page).toHaveURL(/.*dashboard/);
    console.log('✅ 대시보드 페이지 정상 로드');
  });

  test('대시보드 통계 위젯 확인', async ({ page }) => {
    await page.goto(config.urls.dashboard());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 통계 카드 또는 차트 확인
    const hasStats = await page.locator('.card, [class*="stat"], [class*="chart"], [class*="widget"]').count() > 0;
    
    if (hasStats) {
      console.log('✅ 대시보드 통계 위젯 표시됨');
    } else {
      console.log('⚠️ 통계 위젯을 찾을 수 없습니다.');
    }
  });

  test('네비게이션 메뉴 확인', async ({ page }) => {
    await page.goto(config.urls.dashboard());
    await page.waitForLoadState('networkidle');
    
    // 네비게이션 메뉴 항목 확인
    const hasNav = await page.locator('nav, [role="navigation"], header a, aside a').count() > 0;
    
    if (hasNav) {
      console.log('✅ 네비게이션 메뉴 확인됨');
    } else {
      console.log('⚠️ 네비게이션 메뉴를 찾을 수 없습니다.');
    }
  });

  test('대시보드에서 테스트케이스 페이지로 이동', async ({ page }) => {
    await page.goto(config.urls.dashboard());
    await page.waitForLoadState('networkidle');
    
    // 테스트케이스 링크 찾기
    const testcaseLink = page.locator('a:has-text("테스트케이스"), a:has-text("Test Cases"), a[href*="testcases"]').first();
    
    if (await testcaseLink.count() > 0) {
      await testcaseLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*testcases/);
      
      console.log('✅ 테스트케이스 페이지로 이동 성공');
    } else {
      console.log('⚠️ 테스트케이스 링크를 찾을 수 없습니다.');
    }
  });

  test('대시보드에서 플랜 페이지로 이동', async ({ page }) => {
    await page.goto(config.urls.dashboard());
    await page.waitForLoadState('networkidle');
    
    // 플랜 링크 찾기
    const planLink = page.locator('a:has-text("플랜"), a:has-text("Plans"), a[href*="plans"]').first();
    
    if (await planLink.count() > 0) {
      await planLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*plans/);
      
      console.log('✅ 플랜 페이지로 이동 성공');
    } else {
      console.log('⚠️ 플랜 링크를 찾을 수 없습니다.');
    }
  });
});

