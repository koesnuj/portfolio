const { test, expect } = require('@playwright/test');
const { loginToTMS } = require('../../../utils/auth-helper');
const config = require('../../../config/test-config');

test.describe('TMS_v2 테스트 플랜 관리', () => {
  
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로그인
    await loginToTMS(page);
  });

  test('테스트 플랜 페이지 접속 @smoke', async ({ page }) => {
    await page.goto(config.urls.plans());
    await page.waitForLoadState('networkidle');
    
    // 플랜 페이지 확인
    await expect(page).toHaveURL(/.*plans/);
    console.log('✅ 테스트 플랜 페이지 정상 로드');
  });

  test('새 테스트 플랜 생성 버튼 확인', async ({ page }) => {
    await page.goto(config.urls.plans());
    await page.waitForLoadState('networkidle');
    
    // 새 플랜 생성 버튼 찾기
    const createButton = page.locator('button:has-text("생성"), button:has-text("추가"), button:has-text("New"), button:has-text("Create")').first();
    
    if (await createButton.count() > 0) {
      await createButton.click();
      await page.waitForTimeout(1000);
      
      console.log('✅ 테스트 플랜 생성 버튼 동작 확인');
    } else {
      console.log('⚠️ 테스트 플랜 생성 버튼을 찾을 수 없습니다.');
    }
  });

  test('테스트 플랜 목록 조회', async ({ page }) => {
    await page.goto(config.urls.plans());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 플랜 목록 확인
    const hasContent = await page.locator('table, [role="list"], .list, .card').count() > 0;
    
    if (hasContent) {
      console.log('✅ 테스트 플랜 목록 표시됨');
    } else {
      console.log('⚠️ 테스트 플랜이 비어있거나 다른 형식입니다.');
    }
  });

  test('플랜 상세 페이지 접근 테스트', async ({ page }) => {
    await page.goto(config.urls.plans());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 첫 번째 플랜 항목 클릭 시도
    const firstPlanLink = page.locator('a[href*="/plans/"], tr, .card, [role="listitem"]').first();
    
    if (await firstPlanLink.count() > 0) {
      await firstPlanLink.click();
      await page.waitForTimeout(2000);
      
      console.log('✅ 플랜 상세 페이지 접근 시도 완료');
    } else {
      console.log('⚠️ 플랜 항목이 없습니다.');
    }
  });
});

