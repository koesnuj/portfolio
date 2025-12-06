const { test, expect } = require('@playwright/test');

// 환경별 앱 URL 설정
const APP_URLS = {
  qa: 'https://app-qa.ovdr.io',
  dev: 'https://app-dev.ovdr.io',
  'release-qa': 'https://app-release-qa.overdare.com'
};

// 현재 환경 가져오기
const currentEnv = process.env.ETERNAL_ENV || 'qa';
const appUrl = APP_URLS[currentEnv];

/**
 * 앱 로그인 함수
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {Object} options - 로그인 옵션
 * @param {string} options.username - 사용자명 (기본값: test111)
 * @param {string} options.password - 비밀번호 (기본값: test111)
 * @param {boolean} options.skipCookies - 쿠키 동의 건너뛰기 여부
 */
async function loginToApp(page, options = {}) {
  const { username = 'test111', password = 'test111', skipCookies = false } = options;
  
  console.log(`🔐 앱 로그인 시작: ${username}`);
  
  // 앱 메인 페이지로 이동
  await page.goto(appUrl);
  await page.waitForLoadState('networkidle');
  
  // 로그인 버튼 또는 링크 찾기
  const loginSelectors = [
    'a[href*="login"]',
    'button:has-text("로그인")',
    'button:has-text("Login")',
    'button:has-text("Sign In")',
    '[data-testid*="login"]',
    '.login-button',
    '#login-button'
  ];
  
  let loginButton = null;
  for (const selector of loginSelectors) {
    try {
      loginButton = page.locator(selector).first();
      if (await loginButton.isVisible()) {
        console.log(`✅ 로그인 버튼 발견: ${selector}`);
        break;
      }
    } catch (error) {
      // 요소를 찾지 못한 경우 무시
    }
  }
  
  if (loginButton) {
    await loginButton.click();
    await page.waitForLoadState('networkidle');
  } else {
    console.log('ℹ️ 로그인 버튼을 찾을 수 없음, 직접 로그인 페이지로 이동 시도');
    // 직접 로그인 페이지로 이동 시도
    await page.goto(`${appUrl}/login`);
    await page.waitForLoadState('networkidle');
  }
  
  // 쿠키 동의 처리 (건너뛰지 않는 경우)
  if (!skipCookies) {
    await handleCookieConsent(page);
  }
  
  // 로그인 폼 찾기 및 입력
  const usernameSelectors = [
    'input[name="username"]',
    'input[name="email"]',
    'input[type="email"]',
    'input[placeholder*="이메일"]',
    'input[placeholder*="Email"]',
    'input[placeholder*="사용자명"]',
    'input[placeholder*="Username"]',
    '#username',
    '#email'
  ];
  
  const passwordSelectors = [
    'input[name="password"]',
    'input[type="password"]',
    'input[placeholder*="비밀번호"]',
    'input[placeholder*="Password"]',
    '#password'
  ];
  
  // 사용자명 입력
  let usernameInput = null;
  for (const selector of usernameSelectors) {
    try {
      usernameInput = page.locator(selector).first();
      if (await usernameInput.isVisible()) {
        console.log(`✅ 사용자명 입력 필드 발견: ${selector}`);
        break;
      }
    } catch (error) {
      // 요소를 찾지 못한 경우 무시
    }
  }
  
  if (usernameInput) {
    await usernameInput.fill(username);
  } else {
    console.log('⚠️ 사용자명 입력 필드를 찾을 수 없음');
  }
  
  // 비밀번호 입력
  let passwordInput = null;
  for (const selector of passwordSelectors) {
    try {
      passwordInput = page.locator(selector).first();
      if (await passwordInput.isVisible()) {
        console.log(`✅ 비밀번호 입력 필드 발견: ${selector}`);
        break;
      }
    } catch (error) {
      // 요소를 찾지 못한 경우 무시
    }
  }
  
  if (passwordInput) {
    await passwordInput.fill(password);
  } else {
    console.log('⚠️ 비밀번호 입력 필드를 찾을 수 없음');
  }
  
  // 로그인 버튼 클릭
  const submitSelectors = [
    'button[type="submit"]',
    'button:has-text("로그인")',
    'button:has-text("Login")',
    'button:has-text("Sign In")',
    'input[type="submit"]',
    '[data-testid*="login"]',
    '.login-submit',
    '#login-submit'
  ];
  
  let submitButton = null;
  for (const selector of submitSelectors) {
    try {
      submitButton = page.locator(selector).first();
      if (await submitButton.isVisible()) {
        console.log(`✅ 로그인 제출 버튼 발견: ${selector}`);
        break;
      }
    } catch (error) {
      // 요소를 찾지 못한 경우 무시
    }
  }
  
  if (submitButton) {
    await submitButton.click();
    await page.waitForLoadState('networkidle');
  } else {
    console.log('⚠️ 로그인 제출 버튼을 찾을 수 없음');
  }
  
  // 로그인 성공 확인
  try {
    // 로그인 후 리다이렉트나 상태 변화 대기
    await page.waitForTimeout(3000);
    
    // 로그인 성공 지표 확인
    const successIndicators = [
      'a[href*="logout"]',
      'button:has-text("로그아웃")',
      'button:has-text("Logout")',
      '[data-testid*="logout"]',
      '.user-menu',
      '.profile-menu'
    ];
    
    let loginSuccess = false;
    for (const selector of successIndicators) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          console.log(`✅ 로그인 성공 확인: ${selector}`);
          loginSuccess = true;
          break;
        }
      } catch (error) {
        // 요소를 찾지 못한 경우 무시
      }
    }
    
    if (loginSuccess) {
      console.log('✅ 앱 로그인 성공');
    } else {
      console.log('ℹ️ 로그인 성공 지표를 찾을 수 없음 (정상일 수 있음)');
    }
  } catch (error) {
    console.log('ℹ️ 로그인 후 상태 확인 중 오류:', error.message);
  }
}

/**
 * 쿠키 동의 처리 함수
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 */
async function handleCookieConsent(page) {
  console.log('🍪 쿠키 동의 처리 시작');
  
  const cookieSelectors = [
    'button:has-text("동의")',
    'button:has-text("Accept")',
    'button:has-text("Agree")',
    'button:has-text("OK")',
    'button:has-text("확인")',
    '[data-testid*="cookie"]',
    '.cookie-accept',
    '.cookie-consent button',
    '#cookie-accept',
    '#accept-cookies'
  ];
  
  for (const selector of cookieSelectors) {
    try {
      const cookieButton = page.locator(selector).first();
      if (await cookieButton.isVisible()) {
        console.log(`✅ 쿠키 동의 버튼 발견: ${selector}`);
        await cookieButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ 쿠키 동의 완료');
        return;
      }
    } catch (error) {
      // 요소를 찾지 못한 경우 무시
    }
  }
  
  console.log('ℹ️ 쿠키 동의 버튼을 찾을 수 없음');
}

/**
 * 로그인 + 쿠키 동의를 한 번에 처리하는 함수
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @param {Object} options - 로그인 옵션
 */
async function loginAndHandleCookies(page, options = {}) {
  await loginToApp(page, options);
}

/**
 * 앱 로그아웃 함수
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 */
async function logoutFromApp(page) {
  console.log('🚪 앱 로그아웃 시작');
  
  const logoutSelectors = [
    'a[href*="logout"]',
    'button:has-text("로그아웃")',
    'button:has-text("Logout")',
    'button:has-text("Sign Out")',
    '[data-testid*="logout"]',
    '.logout-button',
    '#logout-button'
  ];
  
  for (const selector of logoutSelectors) {
    try {
      const logoutButton = page.locator(selector).first();
      if (await logoutButton.isVisible()) {
        console.log(`✅ 로그아웃 버튼 발견: ${selector}`);
        await logoutButton.click();
        await page.waitForLoadState('networkidle');
        console.log('✅ 앱 로그아웃 완료');
        return;
      }
    } catch (error) {
      // 요소를 찾지 못한 경우 무시
    }
  }
  
  console.log('ℹ️ 로그아웃 버튼을 찾을 수 없음');
}

module.exports = {
  loginToApp,
  handleCookieConsent,
  loginAndHandleCookies,
  logoutFromApp,
  APP_URLS,
  currentEnv,
  appUrl
};
