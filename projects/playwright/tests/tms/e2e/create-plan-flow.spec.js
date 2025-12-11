const { test, expect } = require('@playwright/test');
const config = require('../../../config/test-config');

test.describe('TMS_v2 E2E - 플랜 생성 플로우', () => {
  
  test('전체 플로우: 로그인 → Test Plans & Run → 플랜 생성 → 정보입력 → 테스트케이스 선택 → 플랜 생성 → 생성된 플랜 클릭 @e2e @video', async ({ page }) => {
    test.setTimeout(120000); // 2분 타임아웃
    
    console.log('🎬 E2E 테스트 시작: 플랜 생성 플로우');
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
    
    // 로그인 페이지에 여전히 있는지 확인
    if (currentUrl.includes('login')) {
      // 로그인 페이지에 있을 때만 로그인 폼 영역에서 에러 메시지 확인
      // 페이지 어딘가의 "실패/오류" 텍스트는 무시하고, 로그인 폼 내부의 에러만 체크
      const loginFormContainer = page.locator('form, [class*="bg-white"][class*="rounded-lg"]').first();
      if (await loginFormContainer.count() > 0) {
        const errorMessage = loginFormContainer.locator('[class*="bg-rose"], [class*="text-rose"], text=/오류|error|실패|fail|invalid|로그인에 실패/i').first();
        if (await errorMessage.count() > 0 && await errorMessage.isVisible()) {
          console.log('⚠️ 로그인 폼에서 오류 메시지 발견');
          await page.screenshot({ path: 'login-error.png' });
          throw new Error('로그인 실패: 계정 정보를 확인하세요');
        }
      }
      
      console.log('⚠️ 여전히 로그인 페이지에 있습니다');
      await page.screenshot({ path: 'still-on-login.png' });
      throw new Error('로그인 실패: 페이지가 이동하지 않았습니다');
    }
    
    console.log('✓ 로그인 성공! 페이지 이동됨');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    console.log('✅ STEP 1 완료: 로그인 성공!');
    
    // ============================================
    // STEP 2: 좌측 트리에서 "Test Plans & Runs" 클릭
    // ============================================
    console.log('\n📍 STEP 2: Test Plans & Runs 페이지로 이동');
    
    let currentUrlStep2 = page.url();
    if (!currentUrlStep2.includes('plans')) {
      console.log('✓ 좌측 트리에서 Test Plans & Runs 찾는 중...');
      
      // 좌측 트리에서 Test Plans & Runs 찾기
      const testPlansTreeItem = page.locator('text=/Test Plans & Runs|테스트 플랜|Test Plans/i').first();
      await testPlansTreeItem.waitFor({ state: 'visible', timeout: 10000 });
      await testPlansTreeItem.click();
      console.log('✓ Test Plans & Runs 클릭');
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } else {
      console.log('✓ 이미 Test Plans 페이지에 있습니다');
    }
    
    console.log('✅ STEP 2 완료: Test Plans & Runs 페이지 진입');
    
    // ============================================
    // STEP 3: 우측 상단 "플랜 생성" 버튼 클릭
    // ============================================
    console.log('\n📍 STEP 3: 우측 상단 "플랜 생성" 버튼 클릭');
    
    // 플랜 생성 버튼 찾기 (다양한 패턴)
    const createPlanButtonSelectors = [
      'button:has-text("플랜 생성")',
      'button:has-text("Create Plan")',
      'button:has-text("생성")',
      '[data-testid="create-plan"]',
      'button[class*="create"]'
    ];
    
    let createPlanButton = null;
    for (const selector of createPlanButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.count() > 0) {
        try {
          if (await button.isVisible()) {
            createPlanButton = button;
            console.log(`✓ 플랜 생성 버튼 찾음: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    if (!createPlanButton) {
      console.log('⚠️ 플랜 생성 버튼을 찾을 수 없습니다. 모든 버튼 확인 중...');
      await page.screenshot({ path: 'debug-before-create-plan.png' });
      throw new Error('플랜 생성 버튼을 찾을 수 없습니다');
    }
    
    await createPlanButton.click();
    console.log('✓ 플랜 생성 버튼 클릭');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('✅ STEP 3 완료: 플랜 생성 페이지 진입');
    
    // ============================================
    // STEP 4: 플랜 이름 입력
    // ============================================
    console.log('\n📍 STEP 4: 플랜 이름 입력');
    
    // 플랜 생성 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    console.log('📝 플랜 이름 입력 중...');
    
    // 플랜 이름 입력 필드 찾기 (여러 방법 시도)
    let planNameInput = null;
    
    // 방법 1: label "플랜 이름"과 연결된 input 찾기
    try {
      const label = page.locator('label:has-text("플랜 이름")').first();
      if (await label.count() > 0) {
        const labelFor = await label.getAttribute('for');
        if (labelFor) {
          planNameInput = page.locator(`input#${labelFor}`);
          if (await planNameInput.count() > 0 && await planNameInput.isVisible({ timeout: 2000 })) {
            console.log('✓ label의 for 속성으로 입력 필드 찾음');
          } else {
            planNameInput = null;
          }
        }
        
        // label의 부모 컨테이너에서 input 찾기
        if (!planNameInput) {
          const parentDiv = label.locator('xpath=ancestor::div[1]');
          planNameInput = parentDiv.locator('input[type="text"]').first();
          if (await planNameInput.count() > 0 && await planNameInput.isVisible({ timeout: 2000 })) {
            console.log('✓ label의 부모 컨테이너에서 입력 필드 찾음');
          } else {
            planNameInput = null;
          }
        }
      }
    } catch (e) {
      // 계속 진행
    }
    
    // 방법 2: placeholder로 찾기
    if (!planNameInput) {
      try {
        planNameInput = page.locator('input[placeholder*="2024년 1분기"], input[placeholder*="예:"]').first();
        if (await planNameInput.count() > 0 && await planNameInput.isVisible({ timeout: 2000 })) {
          console.log('✓ placeholder로 입력 필드 찾음');
        } else {
          planNameInput = null;
        }
      } catch (e) {
        planNameInput = null;
      }
    }
    
    // 방법 3: form 내 첫 번째 text input
    if (!planNameInput) {
      try {
        planNameInput = page.locator('form input[type="text"]').first();
        if (await planNameInput.count() > 0 && await planNameInput.isVisible({ timeout: 2000 })) {
          console.log('✓ form 내 첫 번째 text input 찾음');
        } else {
          planNameInput = null;
        }
      } catch (e) {
        planNameInput = null;
      }
    }
    
    if (!planNameInput || await planNameInput.count() === 0) {
      console.log('⚠️ 플랜 이름 입력 필드를 찾을 수 없습니다. 스크린샷 저장 중...');
      await page.screenshot({ path: 'debug-no-plan-name-input.png', fullPage: true });
      throw new Error('플랜 이름 입력 필드를 찾을 수 없습니다');
    }
    
    await planNameInput.waitFor({ state: 'visible', timeout: 5000 });
    await planNameInput.fill(config.testData.plan.name);
    console.log(`✓ 플랜 이름: "${config.testData.plan.name}"`);
    await page.waitForTimeout(500);
    
    console.log('✅ STEP 4 완료: 플랜 이름 입력 완료');
    
    // ============================================
    // STEP 5: 설명 입력
    // ============================================
    console.log('\n📍 STEP 5: 설명 입력');
    
    console.log('📝 설명 입력 중...');
    const descriptionInput = page.locator('textarea[placeholder*="설명"], textarea[placeholder*="description" i], textarea[name="description"]').first();
    if (await descriptionInput.count() > 0) {
      await descriptionInput.waitFor({ state: 'visible', timeout: 5000 });
      await descriptionInput.fill(config.testData.plan.description);
      console.log(`✓ 설명: "${config.testData.plan.description}"`);
      await page.waitForTimeout(500);
    } else {
      console.log('⚠️ 설명 입력 필드를 찾을 수 없습니다 (선택사항이므로 계속 진행)');
    }
    
    console.log('✅ STEP 5 완료: 설명 입력 완료');
    
    // ============================================
    // STEP 6: 테스트 케이스 일부 선택
    // ============================================
    console.log('\n📍 STEP 6: 테스트 케이스 선택');
    
    // 테스트 케이스가 로드될 때까지 대기
    await page.waitForTimeout(2000);
    
    // 테이블 내의 테스트 케이스 체크박스 찾기 (전체 선택 체크박스 제외)
    // 테이블 행 내의 체크박스만 선택
    const testCaseRows = page.locator('tbody tr');
    const rowCount = await testCaseRows.count();
    
    if (rowCount > 0) {
      // 최소 1개, 최대 3개 선택
      const selectCount = Math.min(3, rowCount);
      console.log(`✓ ${selectCount}개의 테스트 케이스 선택 중...`);
      
      for (let i = 0; i < selectCount; i++) {
        const row = testCaseRows.nth(i);
        const checkbox = row.locator('input[type="checkbox"]').first();
        
        if (await checkbox.isVisible()) {
          await checkbox.click();
          await page.waitForTimeout(300);
          console.log(`✓ 테스트 케이스 ${i + 1} 선택됨`);
        }
      }
      
      console.log(`✓ 총 ${selectCount}개의 테스트 케이스 선택 완료`);
    } else {
      // 테이블이 접혀있을 수 있으므로 섹션 헤더 클릭 시도
      console.log('⚠️ 테스트 케이스 테이블이 보이지 않습니다. 섹션 확장 시도 중...');
      const sectionHeaders = page.locator('[class*="section"], button:has-text("섹션"), div:has-text("Section")');
      const sectionCount = await sectionHeaders.count();
      
      if (sectionCount > 0) {
        await sectionHeaders.first().click();
        await page.waitForTimeout(1000);
        
        // 다시 테이블 행 찾기
        const testCaseRowsAfterExpand = page.locator('tbody tr');
        const rowCountAfterExpand = await testCaseRowsAfterExpand.count();
        
        if (rowCountAfterExpand > 0) {
          const selectCount = Math.min(3, rowCountAfterExpand);
          for (let i = 0; i < selectCount; i++) {
            const row = testCaseRowsAfterExpand.nth(i);
            const checkbox = row.locator('input[type="checkbox"]').first();
            if (await checkbox.isVisible()) {
              await checkbox.click();
              await page.waitForTimeout(300);
            }
          }
          console.log(`✓ ${selectCount}개의 테스트 케이스 선택 완료`);
        } else {
          console.log('⚠️ 테스트 케이스를 찾을 수 없습니다. 스크린샷 저장 중...');
          await page.screenshot({ path: 'debug-no-testcases.png' });
          throw new Error('테스트 케이스를 찾을 수 없습니다');
        }
      } else {
        console.log('⚠️ 테스트 케이스를 찾을 수 없습니다. 스크린샷 저장 중...');
        await page.screenshot({ path: 'debug-no-testcases.png' });
        throw new Error('테스트 케이스를 찾을 수 없습니다');
      }
    }
    
    await page.waitForTimeout(1000);
    console.log('✅ STEP 6 완료: 테스트 케이스 선택 완료');
    
    // ============================================
    // STEP 7: 플랜 생성 버튼 클릭
    // ============================================
    console.log('\n📍 STEP 7: 플랜 생성 버튼 클릭');
    
    const submitButtonSelectors = [
      'button:has-text("플랜 생성")',
      'button:has-text("Create Plan")',
      'button[type="submit"]',
      'button:has-text("생성")'
    ];
    
    let submitButton = null;
    for (const selector of submitButtonSelectors) {
      const button = page.locator(selector).first();
      if (await button.count() > 0) {
        try {
          if (await button.isVisible() && !(await button.isDisabled())) {
            submitButton = button;
            console.log(`✓ 플랜 생성 버튼 찾음: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    if (!submitButton) {
      console.log('⚠️ 플랜 생성 버튼을 찾을 수 없습니다.');
      await page.screenshot({ path: 'debug-no-submit-button.png' });
      throw new Error('플랜 생성 버튼을 찾을 수 없습니다');
    }
    
    await submitButton.click();
    console.log('✓ 플랜 생성 버튼 클릭');
    
    // 플랜 생성 완료 대기 (리다이렉트 또는 성공 메시지)
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('✅ STEP 7 완료: 플랜 생성 완료');
    
    // 성공 메시지 확인
    const successMessage = page.locator('text=/성공|success|완료|created|생성됨/i').first();
    if (await successMessage.count() > 0) {
      console.log('🎉 성공 메시지 확인됨');
    }
    
    // ============================================
    // STEP 8: 생성된 플랜 클릭
    // ============================================
    console.log('\n📍 STEP 8: 생성된 플랜 클릭');
    
    // 플랜 목록 페이지로 이동했는지 확인
    const currentUrlAfterCreate = page.url();
    console.log(`✓ 현재 URL: ${currentUrlAfterCreate}`);
    
    if (currentUrlAfterCreate.includes('/plans/create')) {
      console.log('⚠️ 아직 플랜 생성 페이지에 있습니다. 플랜 목록으로 이동 대기 중...');
      await page.waitForTimeout(2000);
    }
    
    // 플랜 목록 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 활성 플랜 섹션에서 생성된 플랜 찾기
    const planName = config.testData.plan.name;
    console.log(`✓ 플랜 이름 "${planName}"으로 활성 플랜 목록에서 검색 중...`);
    
    // 활성 플랜 섹션의 테이블 행에서 플랜 이름이 포함된 행 찾기
    // "활성 플랜" 헤더 다음의 테이블에서 찾기
    const activePlansSection = page.locator('h2:has-text("활성 플랜"), h2:has-text("Active")').first();
    let createdPlanRow = null;
    
    if (await activePlansSection.count() > 0) {
      // 활성 플랜 섹션 내부의 테이블 찾기 (헤더 다음 형제 요소)
      const activeSectionContainer = activePlansSection.locator('xpath=ancestor::div[1]');
      const activeTable = activeSectionContainer.locator('table tbody tr').first();
      
      // 활성 플랜 섹션 내부의 테이블 행에서 플랜 이름이 포함된 행 찾기
      const planRows = activeSectionContainer.locator('tbody tr');
      const rowCount = await planRows.count();
      
      console.log(`✓ 활성 플랜 섹션에서 ${rowCount}개의 행 발견`);
      
      for (let i = 0; i < rowCount; i++) {
        const row = planRows.nth(i);
        const planNameCell = row.locator(`text=${planName}`).first();
        if (await planNameCell.count() > 0 && await planNameCell.isVisible()) {
          createdPlanRow = row;
          console.log(`✓ 활성 플랜 목록에서 생성된 플랜 찾음 (행 ${i + 1})`);
          break;
        }
      }
    }
    
    // 위 방법으로 못 찾으면 다른 방법 시도
    if (!createdPlanRow || await createdPlanRow.count() === 0) {
      // 활성 플랜 섹션 내부의 테이블 행에서 직접 플랜 이름 찾기
      if (await activePlansSection.count() > 0) {
        const activeSectionContainer = activePlansSection.locator('xpath=ancestor::div[1]');
        const planRows = activeSectionContainer.locator(`tbody tr:has-text("${planName}")`).first();
        if (await planRows.count() > 0 && await planRows.isVisible()) {
          createdPlanRow = planRows;
          console.log('✓ 활성 플랜 섹션의 테이블 행에서 생성된 플랜 찾음');
        }
      }
    }
    
    // 여전히 못 찾으면 전체 페이지에서 찾기 (최후의 수단)
    if (!createdPlanRow || await createdPlanRow.count() === 0) {
      const planRows = page.locator(`tbody tr:has-text("${planName}")`).first();
      if (await planRows.count() > 0 && await planRows.isVisible()) {
        createdPlanRow = planRows;
        console.log('✓ 전체 페이지에서 생성된 플랜 찾음');
      }
    }
    
    if (!createdPlanRow || await createdPlanRow.count() === 0) {
      console.log('⚠️ 생성된 플랜을 찾을 수 없습니다. 페이지 확인 중...');
      await page.screenshot({ path: 'debug-no-created-plan.png', fullPage: true });
      throw new Error(`활성 플랜 목록에서 "${planName}" 플랜을 찾을 수 없습니다`);
    }
    
    // 테이블 행 클릭 (체크박스 영역 제외)
    await createdPlanRow.click();
    console.log(`✓ 생성된 플랜 "${planName}" 클릭`);
    
    // 플랜 상세 페이지로 이동 대기
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 플랜 상세 페이지로 이동했는지 확인
    const finalUrl = page.url();
    if (!finalUrl.includes('/plans/')) {
      console.log('⚠️ 플랜 상세 페이지로 이동하지 않았습니다. URL:', finalUrl);
      await page.screenshot({ path: 'debug-plan-detail-not-loaded.png', fullPage: true });
      throw new Error('플랜 상세 페이지로 이동하지 않았습니다');
    }
    
    console.log(`✓ 플랜 상세 페이지 진입: ${finalUrl}`);
    console.log('✅ STEP 8 완료: 생성된 플랜 상세 페이지 진입');
    
    // 최종 대기 (화면 확인용)
    await page.waitForTimeout(3000);
    
    console.log('\n🎬 E2E 테스트 완료!');
    console.log('📹 영상은 test-results 폴더에 저장됩니다.');
  });
});

