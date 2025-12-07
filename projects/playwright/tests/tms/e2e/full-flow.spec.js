const { test, expect } = require('@playwright/test');
const { loginToTMS } = require('../../../utils/auth-helper');
const config = require('../../../config/test-config');

test.describe('TMS_v2 E2E - 로그인부터 테스트케이스 생성까지', () => {
  
  test('전체 플로우: 로그인 → 테스트케이스 생성 @e2e @video', async ({ page }) => {
    test.setTimeout(120000); // 2분 타임아웃
    
    console.log('🎬 E2E 테스트 시작: 로그인부터 테스트케이스 생성까지');
    console.log('📹 영상 녹화 중...');
    
    // ============================================
    // STEP 1: 로그인
    // ============================================
    console.log('\n📍 STEP 1: 로그인 페이지 접속');
    await page.goto(config.urls.login());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    console.log('📧 이메일 입력:', config.testAccount.email);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(config.testAccount.email);
    await page.waitForTimeout(500);
    
    console.log('🔒 비밀번호 입력');
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(config.testAccount.password);
    await page.waitForTimeout(500);
    
    console.log('🔘 로그인 버튼 클릭');
    const loginButton = page.locator('button:has-text("로그인"), button:has-text("Login"), button[type="submit"]').first();
    await loginButton.click();
    
    // 대시보드로 리다이렉트 대기
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('✅ STEP 1 완료: 로그인 성공!');
    
    // ============================================
    // STEP 2: 테스트케이스 페이지로 이동
    // ============================================
    console.log('\n📍 STEP 2: 테스트케이스 페이지로 이동');
    
    // 네비게이션 메뉴에서 테스트케이스 클릭
    const testcaseLink = page.locator('a:has-text("테스트케이스"), a:has-text("Test Cases"), a[href*="testcases"]').first();
    await testcaseLink.waitFor({ state: 'visible', timeout: 5000 });
    await testcaseLink.click();
    
    await page.waitForURL('**/testcases', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('✅ STEP 2 완료: 테스트케이스 페이지 진입');
    
    // ============================================
    // STEP 3: 새 테스트케이스 생성 버튼 클릭
    // ============================================
    console.log('\n📍 STEP 3: 새 테스트케이스 생성 버튼 클릭');
    
    // 테스트케이스 생성 버튼 찾기 (다양한 패턴 시도)
    const createButtonSelectors = [
      'button:has-text("생성")',
      'button:has-text("추가")',
      'button:has-text("New")',
      'button:has-text("Create")',
      'button:has-text("새로 만들기")',
      'button:has-text("테스트케이스 생성")',
      '[data-testid="create-testcase"]',
      'button[class*="create"]',
      'button[class*="add"]'
    ];
    
    let createButton = null;
    for (const selector of createButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.count() > 0 && await button.isVisible().catch(() => false)) {
        createButton = button;
        console.log(`✓ 생성 버튼 찾음: ${selector}`);
        break;
      }
    }
    
    if (createButton) {
      await createButton.click();
      await page.waitForTimeout(1500);
      console.log('✅ STEP 3 완료: 생성 버튼 클릭');
      
      // ============================================
      // STEP 4: 테스트케이스 정보 입력
      // ============================================
      console.log('\n📍 STEP 4: 테스트케이스 정보 입력');
      
      // 제목 입력 필드 찾기
      const titleInput = page.locator('input[name="title"], input[placeholder*="제목"], input[placeholder*="Title"], input[placeholder*="이름"]').first();
      if (await titleInput.count() > 0) {
        const testTitle = `자동 테스트 케이스 ${Date.now()}`;
        await titleInput.fill(testTitle);
        console.log(`📝 제목 입력: ${testTitle}`);
        await page.waitForTimeout(500);
      }
      
      // 설명 입력 필드 찾기
      const descriptionInput = page.locator('textarea[name="description"], textarea[placeholder*="설명"], textarea[placeholder*="Description"], [contenteditable="true"]').first();
      if (await descriptionInput.count() > 0) {
        await descriptionInput.fill('Playwright를 통한 자동화 테스트로 생성된 테스트케이스입니다.');
        console.log('📝 설명 입력 완료');
        await page.waitForTimeout(500);
      }
      
      // 우선순위 선택 (있다면)
      const prioritySelect = page.locator('select[name="priority"], [name="priority"]').first();
      if (await prioritySelect.count() > 0) {
        await prioritySelect.selectOption('HIGH');
        console.log('🎯 우선순위: HIGH 선택');
        await page.waitForTimeout(300);
      }
      
      // ============================================
      // STEP 5: 저장 버튼 클릭
      // ============================================
      console.log('\n📍 STEP 5: 저장 버튼 클릭');
      
      const saveButtonSelectors = [
        'button:has-text("저장")',
        'button:has-text("Save")',
        'button:has-text("생성")',
        'button:has-text("Create")',
        'button[type="submit"]'
      ];
      
      let saveButton = null;
      for (const selector of saveButtonSelectors) {
        const button = page.locator(selector).first();
        if (await button.count() > 0 && await button.isVisible().catch(() => false)) {
          saveButton = button;
          console.log(`✓ 저장 버튼 찾음: ${selector}`);
          break;
        }
      }
      
      if (saveButton) {
        await saveButton.click();
        await page.waitForTimeout(2000);
        console.log('✅ STEP 5 완료: 저장 버튼 클릭');
        
        // 성공 메시지 확인 (옵션)
        const successMessage = page.locator('text=/성공|success|완료|created/i').first();
        if (await successMessage.count() > 0) {
          console.log('🎉 성공 메시지 확인됨');
        }
      } else {
        console.log('⚠️ 저장 버튼을 찾을 수 없습니다. 화면 확인이 필요합니다.');
      }
      
    } else {
      console.log('⚠️ 테스트케이스 생성 버튼을 찾을 수 없습니다.');
      console.log('💡 현재 화면에서 수동으로 확인이 필요합니다.');
    }
    
    // 최종 대기 (화면 확인용)
    await page.waitForTimeout(3000);
    
    console.log('\n🎬 E2E 테스트 완료!');
    console.log('📹 영상은 test-results 폴더에 저장됩니다.');
  });
  
  test('개별 테스트: 로그인만 @smoke', async ({ page }) => {
    console.log('🔐 로그인 테스트 시작');
    
    await page.goto(config.urls.login());
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill(config.testAccount.email);
    
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill(config.testAccount.password);
    
    const loginButton = page.locator('button:has-text("로그인"), button[type="submit"]').first();
    await loginButton.click();
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/.*dashboard/);
    
    console.log('✅ 로그인 테스트 성공');
  });
});

