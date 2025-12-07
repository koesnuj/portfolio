const { test, expect } = require('@playwright/test');
const config = require('../../../config/test-config');

test.describe('TMS_v2 E2E - 로그인부터 테스트케이스 생성까지', () => {
  
  test('전체 플로우: 로그인 → Test Cases → Add case → 정보입력 → Save @e2e @video', async ({ page }) => {
    test.setTimeout(120000); // 2분 타임아웃
    
    console.log('🎬 E2E 테스트 시작: 로그인부터 테스트케이스 생성까지');
    console.log('📹 영상 녹화 중...');
    
    // ============================================
    // STEP 1: 로그인
    // ============================================
    console.log('\n📍 STEP 1: 로그인');
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
    
    // 로그인 후 페이지 이동 대기
    await page.waitForTimeout(3000); // 로그인 처리 대기
    
    const currentUrl = page.url();
    console.log(`✓ 현재 URL: ${currentUrl}`);
    
    // 로그인 실패 시 에러 메시지 확인
    const errorMessage = page.locator('text=/오류|error|실패|fail|invalid/i').first();
    if (await errorMessage.count() > 0 && await errorMessage.isVisible()) {
      console.log('⚠️ 로그인 오류 메시지 발견');
      await page.screenshot({ path: 'login-error.png' });
      throw new Error('로그인 실패: 계정 정보를 확인하세요');
    }
    
    // 로그인 페이지에 여전히 있는지 확인
    if (currentUrl.includes('login')) {
      console.log('⚠️ 여전히 로그인 페이지에 있습니다');
      await page.screenshot({ path: 'still-on-login.png' });
      throw new Error('로그인 실패: 페이지가 이동하지 않았습니다');
    }
    
    console.log('✓ 로그인 성공! 페이지 이동됨');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    console.log('✅ STEP 1 완료: 로그인 성공!');
    
    // ============================================
    // STEP 2: 좌측 트리에서 "Test Cases" 클릭 (이미 테스트케이스 페이지가 아닌 경우)
    // ============================================
    console.log('\n📍 STEP 2: Test Cases 페이지로 이동');
    
    let currentUrlStep2 = page.url();
    if (!currentUrlStep2.includes('testcases') && !currentUrlStep2.includes('test-cases')) {
      console.log('✓ 좌측 트리에서 Test Cases 찾는 중...');
      
      // 좌측 트리에서 Test Cases 찾기
      const testCasesTreeItem = page.locator('text=/Test Cases|테스트케이스|테스트 케이스/i').first();
      await testCasesTreeItem.waitFor({ state: 'visible', timeout: 10000 });
      await testCasesTreeItem.click();
      console.log('✓ Test Cases 클릭');
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } else {
      console.log('✓ 이미 Test Cases 페이지에 있습니다');
    }
    
    console.log('✅ STEP 2 완료: Test Cases 페이지 진입');
    
    // ============================================
    // STEP 3: 우측 상단 "Add case" 버튼 클릭
    // ============================================
    console.log('\n📍 STEP 3: 우측 상단 "Add case" 버튼 클릭');
    
    // Add case 버튼 찾기 (다양한 패턴)
    const addCaseButtonSelectors = [
      'button:has-text("Add case")',
      'button:has-text("Add Case")',
      'button:has-text("케이스 추가")',
      'button:has-text("추가")',
      '[data-testid="add-case"]',
      'button[class*="add"]'
    ];
    
    let addCaseButton = null;
    for (const selector of addCaseButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.count() > 0) {
        try {
          if (await button.isVisible()) {
            addCaseButton = button;
            console.log(`✓ Add case 버튼 찾음: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    if (!addCaseButton) {
      console.log('⚠️ Add case 버튼을 찾을 수 없습니다. 모든 버튼 확인 중...');
      await page.screenshot({ path: 'debug-before-add-case.png' });
    }
    
    await addCaseButton.click();
    console.log('✓ Add case 버튼 클릭');
    await page.waitForTimeout(1500);
    
    console.log('✅ STEP 3 완료: 모달 팝업 열림');
    
    // ============================================
    // STEP 4: 모달에서 정보 입력
    // ============================================
    console.log('\n📍 STEP 4: 테스트케이스 정보 입력');
    
    // Title 입력
    console.log('📝 Title 입력 중...');
    const titleInput = page.locator('input[name="title"], input[placeholder*="title" i], input[placeholder*="제목"]').first();
    await titleInput.waitFor({ state: 'visible', timeout: 5000 });
    await titleInput.fill('playwright 테스트');
    console.log('✓ Title: "playwright 테스트"');
    await page.waitForTimeout(500);
    
    // Precondition 입력
    console.log('📝 Precondition 입력 중...');
    const preconditionInput = page.locator('textarea[name="precondition"], textarea[placeholder*="precondition" i], [name="precondition"]').first();
    if (await preconditionInput.count() > 0) {
      await preconditionInput.fill('playwright 테스트');
      console.log('✓ Precondition: "playwright 테스트"');
      await page.waitForTimeout(500);
    }
    
    // Steps 입력
    console.log('📝 Steps 입력 중...');
    const stepsInput = page.locator('textarea[name="steps"], textarea[placeholder*="steps" i], [name="steps"]').first();
    if (await stepsInput.count() > 0) {
      await stepsInput.fill('playwright 테스트');
      console.log('✓ Steps: "playwright 테스트"');
      await page.waitForTimeout(500);
    }
    
    // Expected Result 입력
    console.log('📝 Expected Result 입력 중...');
    const expectedResultInput = page.locator('textarea[name="expectedResult"], textarea[name="expected"], textarea[placeholder*="expected" i], [name="expectedResult"]').first();
    if (await expectedResultInput.count() > 0) {
      await expectedResultInput.fill('playwright 테스트');
      console.log('✓ Expected Result: "playwright 테스트"');
      await page.waitForTimeout(500);
    }
    
    console.log('✅ STEP 4 완료: 모든 필드 입력 완료');
    
    // ============================================
    // STEP 5: Save 버튼 클릭
    // ============================================
    console.log('\n📍 STEP 5: Save 버튼 클릭');
    
    const saveButtonSelectors = [
      'button:has-text("Save")',
      'button:has-text("저장")',
      'button:has-text("확인")',
      'button[type="submit"]'
    ];
    
    let saveButton = null;
    for (const selector of saveButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.count() > 0) {
        try {
          if (await button.isVisible()) {
            saveButton = button;
            console.log(`✓ Save 버튼 찾음: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    if (saveButton) {
      await saveButton.click();
      console.log('✓ Save 버튼 클릭');
      await page.waitForTimeout(2000);
      
      console.log('✅ STEP 5 완료: 저장 완료');
      
      // 성공 메시지 확인
      const successMessage = page.locator('text=/성공|success|완료|created|saved/i').first();
      if (await successMessage.count() > 0) {
        console.log('🎉 성공 메시지 확인됨');
      }
    } else {
      console.log('⚠️ Save 버튼을 찾을 수 없습니다.');
      await page.screenshot({ path: 'debug-no-save-button.png' });
    }
    
    // 최종 대기 (화면 확인용)
    await page.waitForTimeout(3000);
    
    console.log('\n🎬 E2E 테스트 완료!');
    console.log('📹 영상은 test-results 폴더에 저장됩니다.');
  });
});

