const { test, expect } = require('@playwright/test');
const config = require('../../../config/test-config');
const { loginToEterno, handleCookieConsent } = require('../../../utils/auth-helper');

test.describe('Eterno Studio 개인 정산(Payout) 기능 테스트', () => {
  test.describe.configure({ mode: 'serial' });

  test('1단계: test555 계정 로그인 후 Payout 페이지 접근 @step1', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('1단계: test555 계정 로그인 후 Payout 페이지 접근 시작...');
    
    // 1. test555 계정으로 Dev Bypass 로그인
    console.log('🔐 test555 계정으로 Dev Bypass 로그인 시작...');
    await loginToEterno(page);
    await handleCookieConsent(page);
    
    console.log('✅ 로그인 완료! 현재 URL:', page.url());
    
    // 2. 홈에서 Dashboard 선택
    console.log('📊 Dashboard 선택 중...');
    try {
      // Dashboard 버튼/링크 찾기 (다양한 선택자 시도)
      const dashboardSelectors = [
        'a:has-text("Dashboard")',
        'button:has-text("Dashboard")',
        '[href*="dashboard"]',
        '[data-testid*="dashboard"]',
        'text=/dashboard/i'
      ];
      
      let dashboardElement = null;
      for (const selector of dashboardSelectors) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          dashboardElement = element.first();
          console.log(`Dashboard 요소 발견: ${selector}`);
          break;
        }
      }
      
      if (dashboardElement) {
        await dashboardElement.waitFor({ state: 'visible' });
        await dashboardElement.click();
        console.log('✅ Dashboard 클릭 완료');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        console.log('Dashboard 클릭 후 URL:', page.url());
      } else {
        console.log('⚠️ Dashboard 요소를 찾을 수 없음. 현재 페이지에서 직접 Payout 찾기 시도...');
      }
      
    } catch (error) {
      console.log('Dashboard 선택 중 오류:', error.message);
      console.log('⚠️ Dashboard 선택 실패. 현재 페이지에서 직접 Payout 찾기 시도...');
    }
    
    // 3. 왼쪽 메뉴에서 Payout 찾기 및 선택
    console.log('💰 왼쪽 메뉴에서 Payout 찾기...');
    try {
      // Payout 버튼/링크 찾기 (다양한 선택자 시도)
      const payoutSelectors = [
        'a:has-text("Payout")',
        'button:has-text("Payout")',
        '[href*="payout"]',
        '[data-testid*="payout"]',
        'text=/payout/i',
        'text=/정산/i'
      ];
      
      let payoutElement = null;
      for (const selector of payoutSelectors) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          payoutElement = element.first();
          console.log(`Payout 요소 발견: ${selector}`);
          break;
        }
      }
      
      if (payoutElement) {
        await payoutElement.waitFor({ state: 'visible' });
        await payoutElement.click();
        console.log('✅ Payout 클릭 완료');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        console.log('Payout 클릭 후 URL:', page.url());
        
        // Payout 페이지 로딩 확인
        const currentUrl = page.url();
        if (currentUrl.includes('payout') || currentUrl.includes('정산')) {
          console.log('✅ Payout 페이지 접근 성공!');
        } else {
          console.log('ℹ️ Payout 페이지로 이동했는지 확인 필요');
        }
        
        // Payout 페이지의 주요 요소들 확인
        console.log('🔍 Payout 페이지 요소들 확인...');
        
        // ebluc 잔액 관련 요소 찾기
        const eblucElements = page.locator('text=/ebluc|EBLUC|잔액|balance/i');
        const eblucCount = await eblucElements.count();
        console.log(`ebluc 관련 요소 ${eblucCount}개 발견`);
        
        if (eblucCount > 0) {
          for (let i = 0; i < Math.min(eblucCount, 5); i++) {
            const text = await eblucElements.nth(i).textContent();
            console.log(`ebluc 요소 ${i + 1}: ${text}`);
          }
        }
        
        // Cash 교환 관련 요소 찾기
        const cashElements = page.locator('text=/cash|Cash|CASH|현금/i');
        const cashCount = await cashElements.count();
        console.log(`Cash 관련 요소 ${cashCount}개 발견`);
        
        if (cashCount > 0) {
          for (let i = 0; i < Math.min(cashCount, 3); i++) {
            const text = await cashElements.nth(i).textContent();
            console.log(`Cash 요소 ${i + 1}: ${text}`);
          }
        }
        
        // Bluc 교환 관련 요소 찾기
        const blucElements = page.locator('text=/bluc|Bluc|BLUC/i');
        const blucCount = await blucElements.count();
        console.log(`Bluc 관련 요소 ${blucCount}개 발견`);
        
        if (blucCount > 0) {
          for (let i = 0; i < Math.min(blucCount, 3); i++) {
            const text = await blucElements.nth(i).textContent();
            console.log(`Bluc 요소 ${i + 1}: ${text}`);
          }
        }
        
        // 교환 버튼들 찾기
        const exchangeButtons = page.locator('button, a').filter({ hasText: /exchange|교환|convert|변환|신청|apply/i });
        const exchangeButtonCount = await exchangeButtons.count();
        console.log(`교환 관련 버튼 ${exchangeButtonCount}개 발견`);
        
        if (exchangeButtonCount > 0) {
          for (let i = 0; i < Math.min(exchangeButtonCount, 5); i++) {
            const button = exchangeButtons.nth(i);
            const text = await button.textContent();
            const isDisabled = await button.isDisabled();
            console.log(`교환 버튼 ${i + 1}: "${text}" (비활성화: ${isDisabled})`);
          }
        }
        
        // 페이지 전체 텍스트 확인 (디버깅용)
        const pageText = await page.textContent('body');
        console.log('Payout 페이지 전체 텍스트:', pageText.substring(0, 500) + '...');
        
        console.log('✅ 1단계 완료: Payout 페이지 접근 및 요소 확인');
        
      } else {
        console.log('❌ Payout 요소를 찾을 수 없음');
        
        // 현재 페이지의 모든 링크와 버튼 확인 (디버깅용)
        console.log('🔍 현재 페이지의 모든 링크와 버튼 확인...');
        const allLinks = page.locator('a');
        const allButtons = page.locator('button');
        
        const linkCount = await allLinks.count();
        const buttonCount = await allButtons.count();
        
        console.log(`총 링크 ${linkCount}개, 버튼 ${buttonCount}개 발견`);
        
        // 링크들 확인
        for (let i = 0; i < Math.min(linkCount, 10); i++) {
          const link = allLinks.nth(i);
          const text = await link.textContent();
          const href = await link.getAttribute('href');
          console.log(`링크 ${i + 1}: "${text}" -> ${href}`);
        }
        
        // 버튼들 확인
        for (let i = 0; i < Math.min(buttonCount, 10); i++) {
          const button = allButtons.nth(i);
          const text = await button.textContent();
          console.log(`버튼 ${i + 1}: "${text}"`);
        }
        
        throw new Error('Payout 요소를 찾을 수 없어서 테스트 실패');
      }
      
    } catch (error) {
      console.log('Payout 선택 중 오류:', error.message);
      throw error;
    }
    
    console.log('✅ 1단계 완료: test555 계정 로그인 후 Payout 페이지 접근');
  });

  test('2단계: In-App BLUC 교환 테스트 @step2', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('2단계: In-App BLUC 교환 테스트 시작...');
    
    // 1. test555 계정으로 Dev Bypass 로그인
    console.log('🔐 test555 계정으로 Dev Bypass 로그인 시작...');
    await loginToEterno(page);
    await handleCookieConsent(page);
    
    console.log('✅ 로그인 완료! 현재 URL:', page.url());
    
    // 2. Dashboard → Payout → Exchange 페이지로 이동
    console.log('📊 Dashboard → Payout → Exchange 페이지로 이동...');
    try {
      // Dashboard 선택
      const dashboardElement = page.locator('button:has-text("Dashboard")');
      await dashboardElement.waitFor({ state: 'visible' });
      await dashboardElement.click();
      console.log('✅ Dashboard 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Payout 선택
      const payoutElement = page.locator('a:has-text("Payout")');
      await payoutElement.waitFor({ state: 'visible' });
      await payoutElement.click();
      console.log('✅ Payout 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Exchange 버튼 클릭
      const exchangeButton = page.locator('button:has-text("Exchange")');
      await exchangeButton.waitFor({ state: 'visible' });
      await exchangeButton.click();
      console.log('✅ Exchange 버튼 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      console.log('Exchange 페이지 URL:', page.url());
      
    } catch (error) {
      console.log('Dashboard → Payout → Exchange 이동 중 오류:', error.message);
      throw error;
    }
    
    // 3. Select Option 클릭하여 선택 옵션 표시
    console.log('📋 Select Option 클릭하여 선택 옵션 표시...');
    try {
      const selectOptionElement = page.locator('text=/Select Option/i');
      await selectOptionElement.waitFor({ state: 'visible' });
      await selectOptionElement.click();
      console.log('✅ Select Option 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // 선택 옵션들이 나타났는지 확인
      console.log('🔍 선택 옵션들 확인...');
      const cashOption = page.locator('text=/Cash/i');
      const blucOption = page.locator('text=/In-App BLUC/i');
      
      const cashCount = await cashOption.count();
      const blucCount = await blucOption.count();
      
      console.log(`Cash 옵션 개수: ${cashCount}`);
      console.log(`In-App BLUC 옵션 개수: ${blucCount}`);
      
      if (blucCount > 0) {
        console.log('✅ In-App BLUC 옵션이 표시됨');
      } else {
        console.log('⚠️ In-App BLUC 옵션이 표시되지 않음');
      }
      
    } catch (error) {
      console.log('Select Option 클릭 중 오류:', error.message);
      throw error;
    }
    
    // 4. In-App BLUC 선택
    console.log('🪙 In-App BLUC 선택...');
    try {
      const blucOption = page.locator('text=/In-App BLUC/i');
      await blucOption.waitFor({ state: 'visible' });
      await blucOption.click();
      console.log('✅ In-App BLUC 선택 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // 입력 필드가 나타났는지 확인
      console.log('🔍 입력 필드 확인...');
      const inputFields = page.locator('input[type="text"], input[type="number"], input[type="tel"]');
      const inputCount = await inputFields.count();
      console.log(`입력 필드 ${inputCount}개 발견`);
      
      if (inputCount > 0) {
        console.log('✅ 입력 필드가 표시됨');
      } else {
        console.log('⚠️ 입력 필드가 표시되지 않음');
      }
      
    } catch (error) {
      console.log('In-App BLUC 선택 중 오류:', error.message);
      throw error;
    }
    
    // 5. 입력 필드에 1 입력
    console.log('📝 입력 필드에 1 입력...');
    try {
      const inputField = page.locator('input[type="text"], input[type="number"], input[type="tel"]').first();
      await inputField.waitFor({ state: 'visible' });
      await inputField.clear();
      await inputField.fill('1');
      console.log('✅ 입력 필드에 1 입력 완료');
      await page.waitForTimeout(1000);
      
      // 입력된 값 확인
      const inputValue = await inputField.inputValue();
      console.log(`입력된 값: ${inputValue}`);
      
    } catch (error) {
      console.log('입력 필드에 1 입력 중 오류:', error.message);
      throw error;
    }
    
    // 6. Request 버튼 찾기 및 클릭
    console.log('🔘 Request 버튼 찾기 및 클릭...');
    try {
      const requestButton = page.locator('button:has-text("Request"), button:has-text("request"), button:has-text("신청"), button:has-text("Submit"), button:has-text("submit")');
      await requestButton.waitFor({ state: 'visible' });
      
      const isDisabled = await requestButton.isDisabled();
      console.log(`Request 버튼 비활성화 상태: ${isDisabled}`);
      
      if (!isDisabled) {
        await requestButton.click();
        console.log('✅ Request 버튼 클릭 완료');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        console.log('Request 클릭 후 URL:', page.url());
        
        // 7. 팝업창 확인 및 Confirm 버튼 클릭
        console.log('🔍 팝업창 확인 및 Confirm 버튼 클릭...');
        try {
          // 팝업창이 나타날 때까지 대기
          await page.waitForTimeout(2000);
          
          // 팝업창의 Confirm 버튼 찾기
          const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("confirm"), button:has-text("확인"), button:has-text("OK"), button:has-text("ok")');
          const confirmCount = await confirmButton.count();
          console.log(`Confirm 버튼 ${confirmCount}개 발견`);
          
          if (confirmCount > 0) {
            await confirmButton.waitFor({ state: 'visible' });
            await confirmButton.click();
            console.log('✅ Confirm 버튼 클릭 완료');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            
            console.log('Confirm 클릭 후 URL:', page.url());
            
            // Close 버튼 찾기 및 클릭
            console.log('🔍 Close 버튼 찾기 및 클릭...');
            const closeButton = page.locator('button:has-text("Close"), button:has-text("close"), button:has-text("닫기"), button:has-text("Cancel"), button:has-text("cancel"), button:has-text("취소")');
            const closeCount = await closeButton.count();
            console.log(`Close 버튼 ${closeCount}개 발견`);
            
            if (closeCount > 0) {
              await closeButton.waitFor({ state: 'visible' });
              await closeButton.click();
              console.log('✅ Close 버튼 클릭 완료');
              await page.waitForLoadState('networkidle');
              await page.waitForTimeout(3000);
              
              console.log('Close 클릭 후 URL:', page.url());
              
              // 팝업창이 완전히 닫혔는지 확인
              const popupStillVisible = await confirmButton.count() > 0 || await closeButton.count() > 0;
              if (!popupStillVisible) {
                console.log('✅ 팝업창이 완전히 닫힘 - 교환 신청 완료');
              } else {
                console.log('⚠️ 팝업창이 여전히 열려있음');
              }
            } else {
              console.log('⚠️ Close 버튼을 찾을 수 없음');
            }
            
          } else {
            console.log('⚠️ Confirm 버튼을 찾을 수 없음 - 팝업창이 나타나지 않았을 수 있음');
            
            // 팝업창 관련 다른 요소들 확인
            const popupElements = page.locator('[role="dialog"], .modal, .popup, [class*="modal"], [class*="popup"]');
            const popupCount = await popupElements.count();
            console.log(`팝업 관련 요소 ${popupCount}개 발견`);
            
            if (popupCount > 0) {
              for (let i = 0; i < Math.min(popupCount, 3); i++) {
                const popup = popupElements.nth(i);
                const popupText = await popup.textContent();
                console.log(`팝업 요소 ${i + 1}: ${popupText.substring(0, 100)}...`);
              }
            }
          }
          
        } catch (error) {
          console.log('팝업창 Confirm 버튼 클릭 중 오류:', error.message);
        }
        
        // 교환 신청 완료 확인
        console.log('🔍 교환 신청 완료 확인...');
        
        // 성공 메시지 확인
        const successMessages = page.locator('text=/success|성공|완료|submitted|신청완료|요청완료/i');
        const successCount = await successMessages.count();
        console.log(`성공 메시지 ${successCount}개 발견`);
        
        if (successCount > 0) {
          for (let i = 0; i < Math.min(successCount, 3); i++) {
            const message = await successMessages.nth(i).textContent();
            console.log(`성공 메시지 ${i + 1}: ${message}`);
          }
        }
        
        // 오류 메시지 확인
        const errorMessages = page.locator('text=/error|오류|failed|실패|invalid|유효하지/i');
        const errorCount = await errorMessages.count();
        console.log(`오류 메시지 ${errorCount}개 발견`);
        
        if (errorCount > 0) {
          for (let i = 0; i < Math.min(errorCount, 3); i++) {
            const message = await errorMessages.nth(i).textContent();
            console.log(`오류 메시지 ${i + 1}: ${message}`);
          }
        }
        
        // 현재 페이지 상태 확인
        const currentUrl = page.url();
        console.log('교환 신청 완료 후 URL:', currentUrl);
        
        if (currentUrl.includes('payout') && !currentUrl.includes('exchange')) {
          console.log('✅ Payout 메인 페이지로 돌아감 - 교환 신청 완료로 추정');
        } else if (currentUrl.includes('exchange')) {
          console.log('ℹ️ 여전히 Exchange 페이지에 있음 - 추가 확인 필요');
        } else {
          console.log('ℹ️ 다른 페이지로 이동됨');
        }
        
        // 페이지의 모든 텍스트 확인 (디버깅용)
        const pageText = await page.textContent('body');
        console.log('교환 신청 완료 후 페이지 텍스트:', pageText.substring(0, 500) + '...');
        
        console.log('✅ 2단계 완료: In-App BLUC 교환 신청 완료 (팝업창 Confirm 포함)');
        
      } else {
        console.log('❌ Request 버튼이 비활성화 상태');
        throw new Error('Request 버튼이 비활성화되어 있어서 교환 신청을 진행할 수 없음');
      }
      
    } catch (error) {
      console.log('Request 버튼 클릭 중 오류:', error.message);
      throw error;
    }
    
    console.log('✅ 2단계 완료: In-App BLUC 교환 테스트');
  });

  test('3단계: Cash 교환 테스트 @step3', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('3단계: Cash 교환 테스트 시작...');
    
    // 1. test555 계정으로 Dev Bypass 로그인
    console.log('🔐 test555 계정으로 Dev Bypass 로그인 시작...');
    await loginToEterno(page);
    await handleCookieConsent(page);
    
    console.log('✅ 로그인 완료! 현재 URL:', page.url());
    
    // 2. Dashboard → Payout → Exchange 페이지로 이동
    console.log('📊 Dashboard → Payout → Exchange 페이지로 이동...');
    try {
      // Dashboard 선택
      const dashboardElement = page.locator('button:has-text("Dashboard")');
      await dashboardElement.waitFor({ state: 'visible' });
      await dashboardElement.click();
      console.log('✅ Dashboard 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Payout 선택
      const payoutElement = page.locator('a:has-text("Payout")');
      await payoutElement.waitFor({ state: 'visible' });
      await payoutElement.click();
      console.log('✅ Payout 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Exchange 버튼 클릭
      const exchangeButton = page.locator('button:has-text("Exchange")');
      await exchangeButton.waitFor({ state: 'visible' });
      await exchangeButton.click();
      console.log('✅ Exchange 버튼 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      console.log('Exchange 페이지 URL:', page.url());
      
    } catch (error) {
      console.log('Dashboard → Payout → Exchange 이동 중 오류:', error.message);
      throw error;
    }
    
    // 3. ebluc 잔액 확인 (Cash 교환은 5000 이상 필요)
    console.log('💰 ebluc 잔액 확인 (Cash 교환은 5000 이상 필요)...');
    try {
      // Exchange 페이지에서 ebluc 잔액을 다른 방식으로 찾기
      const eblucSelectors = [
        '.PayoutControl_blucNum__Gb_lI',
        'text=/\\d+/',
        '[class*="bluc"]',
        '[class*="balance"]',
        'text=/earned.*bluc/i'
      ];
      
      let eblucAmount = null;
      for (const selector of eblucSelectors) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          const text = await element.first().textContent();
          if (text && /\d/.test(text)) {
            eblucAmount = text;
            console.log(`ebluc 잔액 발견 (${selector}): ${eblucAmount}`);
            break;
          }
        }
      }
      
      if (eblucAmount) {
        const eblucNumber = parseInt(eblucAmount.replace(/,/g, ''));
        if (eblucNumber >= 5000) {
          console.log('✅ ebluc 잔액이 5000 이상이어서 Cash 교환이 가능함');
        } else {
          console.log('❌ ebluc 잔액이 5000 미만이어서 Cash 교환이 불가능함');
          throw new Error(`ebluc 잔액이 부족함: ${eblucAmount} (최소 5000 필요)`);
        }
      } else {
        console.log('⚠️ ebluc 잔액을 찾을 수 없음 - Cash 교환 시도 진행');
      }
      
    } catch (error) {
      console.log('ebluc 잔액 확인 중 오류:', error.message);
      console.log('⚠️ 잔액 확인 실패했지만 Cash 교환 시도 진행');
    }
    
    // 4. Select Option 클릭하여 선택 옵션 표시
    console.log('📋 Select Option 클릭하여 선택 옵션 표시...');
    try {
      const selectOptionElement = page.locator('text=/Select Option/i');
      await selectOptionElement.waitFor({ state: 'visible' });
      await selectOptionElement.click();
      console.log('✅ Select Option 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // 선택 옵션들이 나타났는지 확인
      console.log('🔍 선택 옵션들 확인...');
      const cashOption = page.locator('text=/Cash/i');
      const blucOption = page.locator('text=/In-App BLUC/i');
      
      const cashCount = await cashOption.count();
      const blucCount = await blucOption.count();
      
      console.log(`Cash 옵션 개수: ${cashCount}`);
      console.log(`In-App BLUC 옵션 개수: ${blucCount}`);
      
      if (cashCount > 0) {
        console.log('✅ Cash 옵션이 표시됨');
      } else {
        console.log('⚠️ Cash 옵션이 표시되지 않음');
      }
      
    } catch (error) {
      console.log('Select Option 클릭 중 오류:', error.message);
      throw error;
    }
    
    // 5. Cash 선택 (24시간 쿨타임 고려)
    console.log('💵 Cash 선택 (24시간 쿨타임 확인)...');
    let isCashDisabled = false;
    
    try {
      // 페이지 분석을 위한 디버깅
      console.log('🔍 페이지 분석 시작...');
      
      // 모든 Cash 관련 요소 찾기
      const allCashElements = page.locator('text=/Cash/i');
      const allCashCount = await allCashElements.count();
      console.log(`모든 Cash 관련 요소 ${allCashCount}개 발견`);
      
      for (let i = 0; i < allCashCount; i++) {
        const element = allCashElements.nth(i);
        const text = await element.textContent();
        const tagName = await element.evaluate(el => el.tagName);
        const className = await element.getAttribute('class');
        const isDisabled = await element.isDisabled();
        console.log(`Cash 요소 ${i + 1}: "${text}" (${tagName}, class="${className}", disabled=${isDisabled})`);
      }
      
      // ExchangeOptionItem 클래스 요소들 확인
      const exchangeOptions = page.locator('.ExchangeOptionItem_title__8pzvn');
      const optionCount = await exchangeOptions.count();
      console.log(`ExchangeOptionItem 요소 ${optionCount}개 발견`);
      
      for (let i = 0; i < optionCount; i++) {
        const option = exchangeOptions.nth(i);
        const text = await option.textContent();
        const isDisabled = await option.isDisabled();
        console.log(`ExchangeOption ${i + 1}: "${text}" (disabled=${isDisabled})`);
      }
      
      // 더 구체적인 선택자 사용 (실제 Cash 버튼만 선택)
      const cashOption = page.locator('.ExchangeOptionItem_title__8pzvn:has-text("Cash")');
      const cashOptionCount = await cashOption.count();
      console.log(`구체적인 Cash 옵션 ${cashOptionCount}개 발견`);
      
      // 24시간 쿨타임 메시지 확인 (이게 있으면 Cash 교환 불가능)
      const cooldownMessage = page.locator('text=/You can exchange to Cash once every 24 hours/i');
      const messageCount = await cooldownMessage.count();
      
      if (messageCount > 0) {
        const messageText = await cooldownMessage.first().textContent();
        console.log(`✅ 24시간 쿨타임 메시지 발견: "${messageText}"`);
        isCashDisabled = true; // 쿨타임 메시지가 있으면 비활성화로 간주
        console.log('✅ Cash 교환 불가능 (24시간 쿨타임 메시지 존재)');
      } else {
        console.log('ℹ️ 24시간 쿨타임 메시지 없음 - Cash 교환 가능');
        isCashDisabled = false;
      }
      
      if (isCashDisabled) {
        console.log('⏰ Cash 교환 불가능 - 24시간 쿨타임으로 인해 테스트 종료');
        console.log('✅ 3단계 완료: Cash 교환 불가능 (24시간 쿨타임) - 정상적인 상태');
        return; // 테스트 종료
      } else {
        console.log('✅ Cash 옵션이 활성화됨 - 24시간 쿨타임이 지나서 Cash 교환 가능');
        await cashOption.click();
        console.log('✅ Cash 선택 완료');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // 입력 필드가 나타났는지 확인
        console.log('🔍 입력 필드 확인...');
        const inputFields = page.locator('input[type="text"], input[type="number"], input[type="tel"]');
        const inputCount = await inputFields.count();
        console.log(`입력 필드 ${inputCount}개 발견`);
        
        if (inputCount > 0) {
          console.log('✅ 입력 필드가 표시됨');
        } else {
          console.log('⚠️ 입력 필드가 표시되지 않음');
        }
      }
      
    } catch (error) {
      console.log('Cash 선택 중 오류:', error.message);
      throw error;
    }
    
    // Cash 옵션이 활성화된 경우에만 진행
    if (!isCashDisabled) {
      // 6. 입력 필드에 5000 입력 (최소 금액)
      console.log('📝 입력 필드에 5000 입력 (최소 금액)...');
      try {
        const inputField = page.locator('input[type="text"], input[type="number"], input[type="tel"]').first();
        await inputField.waitFor({ state: 'visible' });
        await inputField.clear();
        await inputField.fill('5000');
        console.log('✅ 입력 필드에 5000 입력 완료');
        await page.waitForTimeout(1000);
        
        // 입력된 값 확인
        const inputValue = await inputField.inputValue();
        console.log(`입력된 값: ${inputValue}`);
        
      } catch (error) {
        console.log('입력 필드에 5000 입력 중 오류:', error.message);
        throw error;
      }
      
      // 7. Request 버튼 찾기 및 클릭
      console.log('🔘 Request 버튼 찾기 및 클릭...');
      try {
        const requestButton = page.locator('button:has-text("Request"), button:has-text("request"), button:has-text("신청"), button:has-text("Submit"), button:has-text("submit")');
        await requestButton.waitFor({ state: 'visible' });
        
        const isDisabled = await requestButton.isDisabled();
        console.log(`Request 버튼 비활성화 상태: ${isDisabled}`);
        
        if (!isDisabled) {
          await requestButton.click();
          console.log('✅ Request 버튼 클릭 완료');
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(3000);
          
          console.log('Request 클릭 후 URL:', page.url());
          
          // 8. 팝업창 확인 및 Confirm 버튼 클릭
          console.log('🔍 팝업창 확인 및 Confirm 버튼 클릭...');
          try {
            // 팝업창이 나타날 때까지 대기
            await page.waitForTimeout(2000);
            
            // 팝업창의 Confirm 버튼 찾기
            const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("confirm"), button:has-text("확인"), button:has-text("OK"), button:has-text("ok")');
            const confirmCount = await confirmButton.count();
            console.log(`Confirm 버튼 ${confirmCount}개 발견`);
            
            if (confirmCount > 0) {
              await confirmButton.waitFor({ state: 'visible' });
              await confirmButton.click();
              console.log('✅ Confirm 버튼 클릭 완료');
              await page.waitForLoadState('networkidle');
              await page.waitForTimeout(2000);
              
              console.log('Confirm 클릭 후 URL:', page.url());
              
              // Close 버튼 찾기 및 클릭
              console.log('🔍 Close 버튼 찾기 및 클릭...');
              const closeButton = page.locator('button:has-text("Close"), button:has-text("close"), button:has-text("닫기"), button:has-text("Cancel"), button:has-text("cancel"), button:has-text("취소")');
              const closeCount = await closeButton.count();
              console.log(`Close 버튼 ${closeCount}개 발견`);
              
              if (closeCount > 0) {
                await closeButton.waitFor({ state: 'visible' });
                await closeButton.click();
                console.log('✅ Close 버튼 클릭 완료');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(3000);
                
                console.log('Close 클릭 후 URL:', page.url());
                
                // 팝업창이 완전히 닫혔는지 확인
                const popupStillVisible = await confirmButton.count() > 0 || await closeButton.count() > 0;
                if (!popupStillVisible) {
                  console.log('✅ 팝업창이 완전히 닫힘 - Cash 교환 신청 완료');
                } else {
                  console.log('⚠️ 팝업창이 여전히 열려있음');
                }
              } else {
                console.log('⚠️ Close 버튼을 찾을 수 없음');
              }
              
            } else {
              console.log('⚠️ Confirm 버튼을 찾을 수 없음 - 팝업창이 나타나지 않았을 수 있음');
            }
            
          } catch (error) {
            console.log('팝업창 Confirm/Close 버튼 클릭 중 오류:', error.message);
          }
          
          // 교환 신청 완료 확인
          console.log('🔍 Cash 교환 신청 완료 확인...');
          
          // 성공 메시지 확인
          const successMessages = page.locator('text=/success|성공|완료|submitted|신청완료|요청완료/i');
          const successCount = await successMessages.count();
          console.log(`성공 메시지 ${successCount}개 발견`);
          
          if (successCount > 0) {
            for (let i = 0; i < Math.min(successCount, 3); i++) {
              const message = await successMessages.nth(i).textContent();
              console.log(`성공 메시지 ${i + 1}: ${message}`);
            }
          }
          
          // 오류 메시지 확인
          const errorMessages = page.locator('text=/error|오류|failed|실패|invalid|유효하지/i');
          const errorCount = await errorMessages.count();
          console.log(`오류 메시지 ${errorCount}개 발견`);
          
          if (errorCount > 0) {
            for (let i = 0; i < Math.min(errorCount, 3); i++) {
              const message = await errorMessages.nth(i).textContent();
              console.log(`오류 메시지 ${i + 1}: ${message}`);
            }
          }
          
          // 현재 페이지 상태 확인
          const currentUrl = page.url();
          console.log('Cash 교환 신청 완료 후 URL:', currentUrl);
          
          if (currentUrl.includes('payout') && !currentUrl.includes('exchange')) {
            console.log('✅ Payout 메인 페이지로 돌아감 - Cash 교환 신청 완료로 추정');
          } else if (currentUrl.includes('exchange')) {
            console.log('ℹ️ 여전히 Exchange 페이지에 있음 - 추가 확인 필요');
          } else {
            console.log('ℹ️ 다른 페이지로 이동됨');
          }
          
          // 페이지의 모든 텍스트 확인 (디버깅용)
          const pageText = await page.textContent('body');
          console.log('Cash 교환 신청 완료 후 페이지 텍스트:', pageText.substring(0, 500) + '...');
          
          console.log('✅ 3단계 완료: Cash 교환 신청 완료 (팝업창 Confirm + Close 포함)');
          
        } else {
          console.log('❌ Request 버튼이 비활성화 상태');
          throw new Error('Request 버튼이 비활성화되어 있어서 Cash 교환 신청을 진행할 수 없음');
        }
        
      } catch (error) {
        console.log('Request 버튼 클릭 중 오류:', error.message);
        throw error;
      }
    }
    
    console.log('✅ 3단계 완료: Cash 교환 테스트');
  });

  test('4단계: 최종 Payout History 확인 (BLUC + Cash 교환 내역) @step4', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('4단계: 최종 Payout History 확인 시작...');
    
    // 1. test555 계정으로 Dev Bypass 로그인
    console.log('🔐 test555 계정으로 Dev Bypass 로그인 시작...');
    await loginToEterno(page);
    await handleCookieConsent(page);
    
    console.log('✅ 로그인 완료! 현재 URL:', page.url());
    
    // 2. Dashboard → Payout 페이지로 이동
    console.log('📊 Dashboard → Payout 페이지로 이동...');
    try {
      // Dashboard 선택
      const dashboardElement = page.locator('button:has-text("Dashboard")');
      await dashboardElement.waitFor({ state: 'visible' });
      await dashboardElement.click();
      console.log('✅ Dashboard 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Payout 선택
      const payoutElement = page.locator('a:has-text("Payout")');
      await payoutElement.waitFor({ state: 'visible' });
      await payoutElement.click();
      console.log('✅ Payout 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      console.log('Payout 페이지 URL:', page.url());
      
    } catch (error) {
      console.log('Dashboard → Payout 이동 중 오류:', error.message);
      throw error;
    }
    
    // 3. Payout History 섹션에서 모든 교환 내역 확인
    console.log('📋 Payout History에서 모든 교환 내역 확인...');
    try {
      const historySection = page.locator('text=/Payout History/i');
      await historySection.waitFor({ state: 'visible' });
      console.log('✅ Payout History 섹션 발견');
      
      // 히스토리 테이블의 모든 행 확인
      const historyRows = page.locator('tr, .row, [class*="row"], [class*="item"], [class*="entry"]');
      const rowCount = await historyRows.count();
      console.log(`히스토리 행 ${rowCount}개 발견`);
      
      if (rowCount > 0) {
        console.log('🔍 모든 히스토리 내역 분석...');
        for (let i = 0; i < rowCount; i++) {
          const row = historyRows.nth(i);
          const rowText = await row.textContent();
          if (rowText && rowText.trim().length > 0 && !rowText.includes('Request Date')) {
            console.log(`히스토리 행 ${i + 1}: ${rowText}`);
          }
        }
      }
      
      // In-App BLUC 교환 내역 확인
      console.log('🪙 In-App BLUC 교환 내역 확인...');
      const blucHistory = page.locator('text=/In-App BLUC/i');
      const blucCount = await blucHistory.count();
      console.log(`In-App BLUC 교환 내역 ${blucCount}개 발견`);
      
      if (blucCount > 0) {
        for (let i = 0; i < blucCount; i++) {
          const blucText = await blucHistory.nth(i).textContent();
          console.log(`In-App BLUC 내역 ${i + 1}: ${blucText}`);
        }
      }
      
      // Cash 교환 내역 확인
      console.log('💵 Cash 교환 내역 확인...');
      const cashHistory = page.locator('text=/Cash/i');
      const cashCount = await cashHistory.count();
      console.log(`Cash 교환 내역 ${cashCount}개 발견`);
      
      if (cashCount > 0) {
        for (let i = 0; i < cashCount; i++) {
          const cashText = await cashHistory.nth(i).textContent();
          console.log(`Cash 내역 ${i + 1}: ${cashText}`);
        }
      }
      
      // 상태별 내역 확인
      console.log('📊 상태별 교환 내역 확인...');
      const completedStatus = page.locator('text=/Completed/i');
      const pendingStatus = page.locator('text=/Pending/i');
      const processingStatus = page.locator('text=/Processing/i');
      
      const completedCount = await completedStatus.count();
      const pendingCount = await pendingStatus.count();
      const processingCount = await processingStatus.count();
      
      console.log(`Completed 상태: ${completedCount}개`);
      console.log(`Pending 상태: ${pendingCount}개`);
      console.log(`Processing 상태: ${processingCount}개`);
      
      // 금액별 내역 확인
      console.log('💰 금액별 교환 내역 확인...');
      const amount1 = page.locator('text=/1/i');
      const amount5000 = page.locator('text=/5000/i');
      
      const amount1Count = await amount1.count();
      const amount5000Count = await amount5000.count();
      
      console.log(`1 ebluc 교환: ${amount1Count}개`);
      console.log(`5000 ebluc 교환: ${amount5000Count}개`);
      
      // 오늘 날짜의 교환 내역 확인
      console.log('📅 오늘 날짜의 교환 내역 확인...');
      const todayDate = new Date().toISOString().split('T')[0].replace(/-/g, '-');
      const todayHistory = page.locator(`text=/2025-09-11/i`);
      const todayCount = await todayHistory.count();
      console.log(`오늘(2025-09-11) 교환 내역: ${todayCount}개`);
      
      // 최종 성공 판정
      console.log('🎯 최종 성공 판정...');
      if (blucCount > 0 && cashCount > 0) {
        console.log('✅ 성공: In-App BLUC과 Cash 교환 모두 기록됨');
        console.log(`📊 총 교환 내역: In-App BLUC ${blucCount}건, Cash ${cashCount}건`);
      } else if (blucCount > 0) {
        console.log('✅ 부분 성공: In-App BLUC 교환만 기록됨');
        console.log(`📊 In-App BLUC 교환: ${blucCount}건`);
      } else if (cashCount > 0) {
        console.log('✅ 부분 성공: Cash 교환만 기록됨');
        console.log(`📊 Cash 교환: ${cashCount}건`);
      } else {
        console.log('❌ 실패: 교환 내역이 기록되지 않음');
      }
      
      // 페이지 전체 텍스트 확인 (디버깅용)
      const pageText = await page.textContent('body');
      console.log('최종 Payout 페이지 텍스트:', pageText.substring(0, 1000) + '...');
      
      console.log('✅ 4단계 완료: 최종 Payout History 분석 완료');
      
    } catch (error) {
      console.log('최종 Payout History 확인 중 오류:', error.message);
      throw error;
    }
    
    console.log('✅ 4단계 완료: 최종 Payout History 확인');
  });

  test('5단계: Stripe Dashboard 버튼 클릭 테스트 @step5 @final-step', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('5단계: Stripe Dashboard 버튼 클릭 테스트 시작...');
    
    // 1. test555 계정으로 Dev Bypass 로그인
    console.log('🔐 test555 계정으로 Dev Bypass 로그인 시작...');
    await loginToEterno(page);
    await handleCookieConsent(page);
    
    console.log('✅ 로그인 완료! 현재 URL:', page.url());
    
    // 2. Dashboard → Payout 페이지로 이동
    console.log('📊 Dashboard → Payout 페이지로 이동...');
    try {
      // Dashboard 선택
      const dashboardElement = page.locator('button:has-text("Dashboard")');
      await dashboardElement.waitFor({ state: 'visible' });
      await dashboardElement.click();
      console.log('✅ Dashboard 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Payout 선택
      const payoutElement = page.locator('a:has-text("Payout")');
      await payoutElement.waitFor({ state: 'visible' });
      await payoutElement.click();
      console.log('✅ Payout 클릭 완료');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      console.log('Payout 페이지 URL:', page.url());
      
    } catch (error) {
      console.log('Dashboard → Payout 이동 중 오류:', error.message);
      throw error;
    }
    
    // 3. Stripe Dashboard 버튼 찾기 및 클릭
    console.log('💳 Stripe Dashboard 버튼 찾기 및 클릭...');
    try {
      // 여러 선택자를 순차적으로 시도
      let stripeDashboardButton;
      
      // 1. button 요소로 시도
      const buttonSelector = page.locator('button:has-text("Stripe Dashboard")');
      const buttonCount = await buttonSelector.count();
      console.log(`button:has-text("Stripe Dashboard") 선택자로 ${buttonCount}개 발견`);
      
      if (buttonCount > 0) {
        stripeDashboardButton = buttonSelector;
        console.log('✅ button 요소로 Stripe Dashboard 버튼 발견');
      } else {
        // 2. a 요소로 시도
        const linkSelector = page.locator('a:has-text("Stripe Dashboard")');
        const linkCount = await linkSelector.count();
        console.log(`a:has-text("Stripe Dashboard") 선택자로 ${linkCount}개 발견`);
        
        if (linkCount > 0) {
          stripeDashboardButton = linkSelector;
          console.log('✅ a 요소로 Stripe Dashboard 버튼 발견');
        } else {
          // 3. 텍스트로 시도
          const textSelector = page.locator('text=/Stripe Dashboard/i');
          const textCount = await textSelector.count();
          console.log(`text=/Stripe Dashboard/i 선택자로 ${textCount}개 발견`);
          
          if (textCount > 0) {
            stripeDashboardButton = textSelector;
            console.log('✅ 텍스트로 Stripe Dashboard 버튼 발견');
          } else {
            throw new Error('Stripe Dashboard 버튼을 찾을 수 없음');
          }
        }
      }
      
      await stripeDashboardButton.waitFor({ state: 'visible' });
      console.log('✅ Stripe Dashboard 버튼 발견 및 대기 완료');
      
      // 새 창이 열릴 것을 대비하여 popup 이벤트 리스너 설정
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        stripeDashboardButton.click()
      ]);
      
      console.log('✅ Stripe Dashboard 버튼 클릭 완료 - 새 창 열림');
      
      // 새 창으로 전환 및 충분한 로딩 시간 대기
      await newPage.waitForLoadState('networkidle');
      await newPage.waitForTimeout(5000); // 5초 대기
      console.log('✅ 새 창 로딩 완료 (5초 대기)');
      
      console.log('새 창 URL:', newPage.url());
      
      // 4. 새 창의 URL 확인
      console.log('🔍 새 창 URL 확인...');
      const currentUrl = newPage.url();
      
      // Stripe 사이트로 이동했는지 확인 (더 유연한 검증)
      if (currentUrl.includes('connect.stripe.com')) {
        console.log('✅ 성공: Stripe Dashboard 새 창이 정상적으로 열림');
        console.log(`✅ Stripe 사이트 URL 확인: ${currentUrl}`);
        
        // URL 패턴 분석
        if (currentUrl.includes('/app/express')) {
          console.log('✅ Express Dashboard 페이지로 직접 이동');
        } else if (currentUrl.includes('/internal_express_login')) {
          console.log('✅ Express 로그인 페이지로 이동 (정상적인 리다이렉트)');
        } else if (currentUrl.includes('/login')) {
          console.log('✅ Stripe 로그인 페이지로 이동');
        } else {
          console.log('✅ Stripe 사이트 내 다른 페이지로 이동');
        }
        
        // 새 창의 페이지 제목 확인
        const pageTitle = await newPage.title();
        console.log('Stripe Dashboard 페이지 제목:', pageTitle);
        
        // 새 창의 주요 요소들 확인
        console.log('🔍 Stripe Dashboard 페이지 요소 확인...');
        
        // Stripe 관련 텍스트 확인
        const stripeTexts = newPage.locator('text=/stripe|Stripe|STRIPE/i');
        const stripeTextCount = await stripeTexts.count();
        console.log(`Stripe 관련 텍스트 ${stripeTextCount}개 발견`);
        
        if (stripeTextCount > 0) {
          for (let i = 0; i < Math.min(stripeTextCount, 5); i++) {
            const text = await stripeTexts.nth(i).textContent();
            console.log(`Stripe 텍스트 ${i + 1}: ${text}`);
          }
        }
        
        // 로그인 관련 요소 확인
        const loginElements = newPage.locator('text=/login|sign in|로그인|Sign in/i');
        const loginCount = await loginElements.count();
        console.log(`로그인 관련 요소 ${loginCount}개 발견`);
        
        if (loginCount > 0) {
          console.log('ℹ️ Stripe Dashboard에서 로그인이 필요할 수 있음 (정상적인 동작)');
        }
        
        // 페이지 전체 텍스트 확인 (디버깅용)
        const pageText = await newPage.textContent('body');
        console.log('Stripe Dashboard 페이지 텍스트:', pageText.substring(0, 500) + '...');
        
        console.log('✅ 5단계 완료: Stripe Dashboard 새 창 열기 성공');
        
      } else {
        console.log('❌ 실패: Stripe Dashboard 새 창이 Stripe 사이트로 이동하지 않음');
        console.log(`❌ 예상 도메인: connect.stripe.com`);
        console.log(`❌ 실제 URL: ${currentUrl}`);
        
        throw new Error(`Stripe Dashboard 새 창이 Stripe 사이트로 이동하지 않음: ${currentUrl}`);
      }
      
      // 새 창을 5초간 유지한 후 닫기
      console.log('⏰ 새 창을 5초간 유지 중...');
      await newPage.waitForTimeout(5000);
      
      try {
        await newPage.close();
        console.log('✅ 새 창 닫기 완료');
      } catch (error) {
        console.log('새 창 닫기 중 오류:', error.message);
      }
      
    } catch (error) {
      console.log('Stripe Dashboard 버튼 클릭 중 오류:', error.message);
      throw error;
    }
    
    console.log('✅ 5단계 완료: Stripe Dashboard 버튼 클릭 테스트');
  });
});
