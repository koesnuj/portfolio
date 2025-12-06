const { test, expect } = require('@playwright/test');

// 환경별 앱 URL 설정
const APP_URLS = {
  qa: 'https://app-qa.ovdr.io',
  dev: 'https://app-dev.ovdr.io',
  'release-qa': 'https://app-release-qa.overdare.com'
};

// 현재 환경 가져오기 (기본값: qa)
const currentEnv = process.env.ETERNAL_ENV || 'qa';
const appUrl = APP_URLS[currentEnv];

test.describe('Eterno App 기본 테스트', () => {
  test('앱 메인 페이지 접속 @step1', async ({ page }) => {
    console.log(`🌐 앱 URL: ${appUrl}`);
    console.log(`🔧 환경: ${currentEnv}`);
    
    // 앱 메인 페이지로 이동
    await page.goto(appUrl);
    
    // 페이지 로딩 대기
    await page.waitForLoadState('networkidle');
    
    // 페이지 제목 확인
    const title = await page.title();
    console.log(`📱 페이지 제목: ${title}`);
    
    // 스크린샷 저장
    await page.screenshot({ 
      path: `screenshots/app-main-page-${currentEnv}.png`,
      fullPage: true 
    });
    
    // 기본적인 페이지 요소 확인
    await expect(page).toHaveTitle(/Eterno|App|OVERDARE/i);
    
    console.log('✅ 앱 메인 페이지 접속 성공');
  });

  test('앱 로딩 상태 확인 @step2', async ({ page }) => {
    await page.goto(appUrl);
    
    // 로딩 스피너나 로딩 상태 확인
    try {
      // 로딩 스피너가 있다면 사라질 때까지 대기
      await page.waitForSelector('[data-testid="loading"], .loading, .spinner', { 
        state: 'hidden', 
        timeout: 10000 
      });
      console.log('✅ 로딩 완료');
    } catch (error) {
      console.log('ℹ️ 로딩 스피너를 찾을 수 없음 (정상일 수 있음)');
    }
    
    // 페이지가 완전히 로드되었는지 확인
    await page.waitForLoadState('domcontentloaded');
    
    // 스크린샷 저장
    await page.screenshot({ 
      path: `screenshots/app-loaded-${currentEnv}.png`,
      fullPage: true 
    });
    
    console.log('✅ 앱 로딩 상태 확인 완료');
  });

  test('앱 기본 네비게이션 확인 @step3', async ({ page }) => {
    await page.goto(appUrl);
    await page.waitForLoadState('networkidle');
    
    // 일반적인 앱 네비게이션 요소들 확인
    const navigationElements = [
      'nav', 'header', 'menu', 'sidebar',
      '[role="navigation"]', '[data-testid*="nav"]',
      '.navbar', '.header', '.menu'
    ];
    
    let foundNavigation = false;
    for (const selector of navigationElements) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          console.log(`✅ 네비게이션 요소 발견: ${selector}`);
          foundNavigation = true;
          break;
        }
      } catch (error) {
        // 요소를 찾지 못한 경우 무시
      }
    }
    
    if (!foundNavigation) {
      console.log('ℹ️ 네비게이션 요소를 찾을 수 없음');
    }
    
    // 스크린샷 저장
    await page.screenshot({ 
      path: `screenshots/app-navigation-${currentEnv}.png`,
      fullPage: true 
    });
    
    console.log('✅ 앱 기본 네비게이션 확인 완료');
  });
});
