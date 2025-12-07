const config = require('../config/test-config');

/**
 * TMS_v2 자동 로그인 함수
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<void>}
 */
async function loginToTMS(page) {
  console.log('🔐 TMS_v2 로그인 시작...');
  
  try {
    // 1. 로그인 페이지로 이동
    await page.goto(config.urls.login());
    await page.waitForLoadState('networkidle');
    
    // 2. 이메일 입력
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="이메일"], input[placeholder*="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(config.testAccount.email);
    console.log('📧 이메일 입력 완료');
    
    // 3. 비밀번호 입력
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(config.testAccount.password);
    console.log('🔒 비밀번호 입력 완료');
    
    // 4. 로그인 버튼 클릭
    const loginButton = page.locator('button:has-text("로그인"), button:has-text("Login"), button[type="submit"]').first();
    await loginButton.waitFor({ state: 'visible' });
    await loginButton.click();
    console.log('🔘 로그인 버튼 클릭');
    
    // 5. 대시보드로 리다이렉트 대기
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    console.log('✅ TMS_v2 로그인 완료!');
  } catch (error) {
    console.error('❌ 로그인 실패:', error.message);
    throw error;
  }
}

/**
 * TMS_v2 회원가입 함수
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {Object} userData - 사용자 데이터 (email, password, username)
 * @returns {Promise<void>}
 */
async function registerToTMS(page, userData = config.testAccount) {
  console.log('📝 TMS_v2 회원가입 시작...');
  
  try {
    // 1. 회원가입 페이지로 이동
    await page.goto(config.urls.register());
    await page.waitForLoadState('networkidle');
    
    // 2. 사용자명 입력
    const usernameInput = page.locator('input[name="username"], input[placeholder*="이름"], input[placeholder*="name"]').first();
    await usernameInput.waitFor({ state: 'visible' });
    await usernameInput.fill(userData.username);
    
    // 3. 이메일 입력
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await emailInput.fill(userData.email);
    
    // 4. 비밀번호 입력
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill(userData.password);
    
    // 5. 회원가입 버튼 클릭
    const registerButton = page.locator('button:has-text("회원가입"), button:has-text("Register"), button[type="submit"]').first();
    await registerButton.click();
    
    await page.waitForTimeout(2000);
    console.log('✅ TMS_v2 회원가입 완료!');
  } catch (error) {
    console.error('❌ 회원가입 실패:', error.message);
    throw error;
  }
}

/**
 * TMS_v2 로그아웃 함수
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<void>}
 */
async function logoutFromTMS(page) {
  console.log('🚪 TMS_v2 로그아웃 시작...');
  
  try {
    // 프로필/설정 메뉴 찾기
    const logoutButton = page.locator('button:has-text("로그아웃"), button:has-text("Logout"), a:has-text("로그아웃"), a:has-text("Logout")').first();
    
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      await page.waitForURL('**/login');
      console.log('✅ 로그아웃 완료!');
    } else {
      console.log('⚠️ 로그아웃 버튼을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('❌ 로그아웃 실패:', error.message);
  }
}

module.exports = {
  loginToTMS,
  registerToTMS,
  logoutFromTMS,
  // 하위 호환성을 위한 별칭
  loginToEterno: loginToTMS,
  loginAndHandleCookies: loginToTMS
};
