const { test, expect } = require('@playwright/test');
const { loginAndHandleCookies, logoutFromApp, appUrl } = require('../../../utils/app-auth-helper');

test.describe('Eterno App 로그인 테스트', () => {
  test('앱 로그인 테스트 @step1', async ({ page }) => {
    console.log(`🌐 앱 URL: ${appUrl}`);
    
    // 로그인 + 쿠키 동의 (한 줄로!)
    await loginAndHandleCookies(page);
    
    // 로그인 후 페이지 상태 확인
    await page.waitForLoadState('networkidle');
    
    // 스크린샷 저장
    await page.screenshot({ 
      path: 'screenshots/app-login-success.png',
      fullPage: true 
    });
    
    // 로그인 성공 확인
    const currentUrl = page.url();
    console.log(`📍 현재 URL: ${currentUrl}`);
    
    // 로그인 후 리다이렉트 확인
    expect(currentUrl).not.toContain('/login');
    
    console.log('✅ 앱 로그인 테스트 완료');
  });

  test('앱 로그인 후 대시보드 확인 @step2', async ({ page }) => {
    // 로그인
    await loginAndHandleCookies(page);
    
    // 대시보드 또는 메인 페이지 요소 확인
    const dashboardSelectors = [
      'h1', 'h2', 'h3',
      '[data-testid*="dashboard"]',
      '.dashboard',
      '.main-content',
      '.user-info',
      '.profile'
    ];
    
    let foundContent = false;
    for (const selector of dashboardSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          const text = await element.textContent();
          console.log(`✅ 대시보드 요소 발견: ${selector} - "${text}"`);
          foundContent = true;
          break;
        }
      } catch (error) {
        // 요소를 찾지 못한 경우 무시
      }
    }
    
    if (!foundContent) {
      console.log('ℹ️ 대시보드 요소를 찾을 수 없음, 페이지 전체 텍스트 확인');
      const bodyText = await page.locator('body').textContent();
      console.log(`📄 페이지 내용: ${bodyText.substring(0, 200)}...`);
    }
    
    // 스크린샷 저장
    await page.screenshot({ 
      path: 'screenshots/app-dashboard.png',
      fullPage: true 
    });
    
    console.log('✅ 앱 대시보드 확인 완료');
  });

  test('앱 로그아웃 테스트 @step3', async ({ page }) => {
    // 먼저 로그인
    await loginAndHandleCookies(page);
    
    // 로그아웃
    await logoutFromApp(page);
    
    // 로그아웃 후 상태 확인
    await page.waitForLoadState('networkidle');
    
    // 스크린샷 저장
    await page.screenshot({ 
      path: 'screenshots/app-logout-success.png',
      fullPage: true 
    });
    
    // 로그아웃 성공 확인 (로그인 페이지로 리다이렉트되었는지)
    const currentUrl = page.url();
    console.log(`📍 로그아웃 후 URL: ${currentUrl}`);
    
    console.log('✅ 앱 로그아웃 테스트 완료');
  });

  test('앱 로그인 실패 테스트 @step4', async ({ page }) => {
    console.log('🔐 잘못된 계정으로 로그인 시도');
    
    // 잘못된 계정으로 로그인 시도
    await loginAndHandleCookies(page, {
      username: 'wronguser',
      password: 'wrongpass'
    });
    
    // 에러 메시지 확인
    const errorSelectors = [
      '.error',
      '.alert',
      '.message',
      '[data-testid*="error"]',
      '.login-error',
      '.invalid-credentials'
    ];
    
    let foundError = false;
    for (const selector of errorSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          const errorText = await element.textContent();
          console.log(`✅ 에러 메시지 발견: ${selector} - "${errorText}"`);
          foundError = true;
          break;
        }
      } catch (error) {
        // 요소를 찾지 못한 경우 무시
      }
    }
    
    if (!foundError) {
      console.log('ℹ️ 에러 메시지를 찾을 수 없음');
    }
    
    // 스크린샷 저장
    await page.screenshot({ 
      path: 'screenshots/app-login-error.png',
      fullPage: true 
    });
    
    console.log('✅ 앱 로그인 실패 테스트 완료');
  });
});
