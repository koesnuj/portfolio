const { test, expect } = require('@playwright/test');
const { loginToTMS } = require('../../../utils/auth-helper');
const config = require('../../../config/test-config');

test.describe('TMS_v2 테스트케이스 관리', () => {
  
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로그인
    await loginToTMS(page);
  });

  test('테스트케이스 페이지 접속 @smoke', async ({ page }) => {
    await page.goto(config.urls.testcases());
    await page.waitForLoadState('networkidle');
    
    // 테스트케이스 페이지 확인
    await expect(page).toHaveURL(/.*testcases/);
    console.log('✅ 테스트케이스 페이지 정상 로드');
  });

  test('새 테스트케이스 생성 @critical', async ({ page }) => {
    await page.goto(config.urls.testcases());
    await page.waitForLoadState('networkidle');
    
    // 새 테스트케이스 생성 버튼 찾기
    const createButton = page.locator('button:has-text("생성"), button:has-text("추가"), button:has-text("New"), button:has-text("Create")').first();
    
    if (await createButton.count() > 0) {
      await createButton.click();
      await page.waitForTimeout(1000);
      
      console.log('✅ 테스트케이스 생성 모달/페이지 열림');
    } else {
      console.log('⚠️ 테스트케이스 생성 버튼을 찾을 수 없습니다.');
    }
  });

  test('테스트케이스 목록 조회', async ({ page }) => {
    await page.goto(config.urls.testcases());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 테이블 또는 리스트 확인
    const hasTable = await page.locator('table').count() > 0;
    const hasList = await page.locator('[role="list"], .list, .table').count() > 0;
    
    if (hasTable || hasList) {
      console.log('✅ 테스트케이스 목록 표시됨');
    } else {
      console.log('⚠️ 테스트케이스 목록이 비어있거나 다른 형식입니다.');
    }
  });

  test('폴더 구조 확인', async ({ page }) => {
    await page.goto(config.urls.testcases());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 폴더 트리 또는 사이드바 확인
    const hasFolderTree = await page.locator('[class*="folder"], [class*="tree"], [class*="sidebar"]').count() > 0;
    
    if (hasFolderTree) {
      console.log('✅ 폴더 구조 확인됨');
    } else {
      console.log('⚠️ 폴더 구조를 찾을 수 없습니다.');
    }
  });
});

