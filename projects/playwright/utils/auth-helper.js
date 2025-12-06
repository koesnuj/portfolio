const config = require('../config/test-config');

/**
 * Eterno Studio 자동 로그인 함수 (Dev Bypass 방식)
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<void>}
 */
async function loginToEterno(page) {
  console.log('🔐 Eterno Studio 로그인 시작... (Dev Bypass 방식)');
  
  // 1. 로그인 페이지로 이동
  await page.goto(config.urls.login());
  
  // 2. 쿠키 동의 팝업이 있다면 먼저 처리
  await handleCookieConsent(page);
  
  // 3. [Dev] Bypass Sign in 버튼 클릭
  const bypassButton = page.locator('button:has-text("[Dev] Bypass Sign in")');
  await bypassButton.waitFor({ state: 'visible' });
  await bypassButton.click();
  
  // 4. Dev Bypass 로그인 폼에서 사용자명 입력
  await page.waitForTimeout(2000); // 폼 로딩 대기
  const usernameInput = page.locator('input[type="text"], input[name="username"], input[placeholder*="username"], input[placeholder*="user"]').first();
  await usernameInput.waitFor({ state: 'visible' });
  await usernameInput.fill(config.devBypass.username);
  
  // 5. 비밀번호 입력
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.fill(config.devBypass.password);
  
  // 6. Log in 버튼 클릭 (더 구체적인 선택자 사용)
  const loginButton = page.locator('button:has-text("Log in"), button:has-text("Login"), button[type="submit"]').first();
  await loginButton.waitFor({ state: 'visible' });
  await loginButton.click();
  
  // 7. 홈페이지로 리다이렉트 대기
  const environment = config.environment || 'qa'; // 기본값 설정
  const baseUrl = config.environments[environment].baseUrl;
  const domain = baseUrl.replace('https://', '').replace('http://', '');
  await page.waitForURL(`**/${domain}/**`);
  
  // 8. 홈 진입 후 안정적인 대기
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  
  console.log('✅ Dev Bypass 로그인 완료!');
}

/**
 * 쿠키 동의 팝업 처리 함수
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<void>}
 */
async function handleCookieConsent(page) {
  try {
    const cookieAcceptButton = page.locator('button:has-text("Accept All"), button.primary_QRLmx:has-text("Accept All")');
    if (await cookieAcceptButton.count() > 0) {
      console.log('🍪 쿠키 동의 팝업 발견! Accept All 버튼 클릭...');
      await cookieAcceptButton.first().click();
      await page.waitForTimeout(1000);
    }
  } catch (error) {
    console.log('🍪 쿠키 동의 팝업이 없거나 이미 처리됨');
  }
}

/**
 * Eterno Studio 로그인 및 쿠키 동의 처리 (통합 함수)
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<void>}
 */
async function loginAndHandleCookies(page) {
  await loginToEterno(page);
  await handleCookieConsent(page);
}

module.exports = {
  loginToEterno,
  handleCookieConsent,
  loginAndHandleCookies
};
