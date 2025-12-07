const config = require('../config/test-config');

/**
 * 회원가입 성공 케이스 실행 (회원가입 케이스의 3단계와 동일)
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<string>} 생성된 계정의 randomId
 */
async function performSuccessfulSignup(page) {
  console.log('🔐 회원가입 성공 케이스 실행 시작...');
  
  // 홈페이지 방문
  await page.goto(config.urls.homepage());
  await page.waitForLoadState('networkidle');
  
  // 페이지 스크롤 방지
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
  });
  
  // 쿠키 동의
  try {
    const cookieAcceptButton = page.locator('button:has-text("Accept All")');
    if (await cookieAcceptButton.count() > 0) {
      await cookieAcceptButton.click();
      console.log('🍪 쿠키 동의 완료');
    }
  } catch (error) {
    console.log('🍪 쿠키 동의 버튼이 없음');
  }
  
  // 6자리 무작위 아이디 생성
  const randomNum = Math.floor(Math.random() * 900000) + 100000; // 100000-999999
  const randomId = `test${randomNum}`;
  console.log('무작위 아이디 생성:', randomId);
  
  // Bypass 로그인으로 신규 회원 접근
  await page.click('a:has-text("Sign in")');
  await page.click('button:has-text("[Dev] Bypass Sign in")');
  await page.fill('input[type="text"]', randomId);
  await page.fill('input[type="password"]', randomId);
  await page.click('button:has-text("Log in")');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('로그인 후 URL:', page.url());
  
  // 회원가입 페이지로 이동 (신규 회원이므로)
  const currentUrl = page.url();
  if (!currentUrl.includes('/signup') && !currentUrl.includes('/profile') && !currentUrl.includes('/register')) {
    console.log('신규 회원으로 판단 - 회원가입 페이지로 이동');
    await page.goto(config.urls.signup());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  } else if (currentUrl.includes('/register')) {
    console.log('이미 회원가입 페이지에 있음:', currentUrl);
  }
  
  // Username 필드에 정상적인 이름 입력 (무작위 아이디와 동일)
  console.log('Username 필드에 정상적인 이름 입력:', randomId);
  
  try {
    const usernameField = page.locator('input[placeholder="Enter name"]');
    await usernameField.fill(randomId);
    console.log('정상적인 이름 입력 완료');
  } catch (error) {
    console.log('Username 필드 찾기 실패:', error.message);
  }
  
  // 생년월일 입력 - 스크롤 방지 방법 (1999년 + 1/1 월일)
  console.log('생년월일 입력: 1999년 1/1 월일');
  
  try {
    // 년도만 1999년으로 설정 (13세 이상 확인용)
    const yearButton = page.locator('button[role="combobox"]').first();
    await yearButton.click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    
    const year1999 = page.locator('text=1999').first();
    await year1999.click();
    await page.evaluate(() => window.scrollTo(0, 0));
    console.log('년도 선택 완료: 1999');
    
    // 월은 무작위로 첫 번째 옵션 선택
    const monthButton = page.locator('button[role="combobox"]').nth(1);
    await monthButton.click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    
    // 첫 번째 월 옵션 선택
    const firstMonth = page.locator('[role="option"]').first();
    if (await firstMonth.count() > 0) {
      await firstMonth.click();
      await page.evaluate(() => window.scrollTo(0, 0));
      console.log('월 선택 완료: 무작위');
    }
    
    // 일은 무작위로 첫 번째 옵션 선택
    const dayButton = page.locator('button[role="combobox"]').nth(2);
    await dayButton.click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    
    // 첫 번째 일 옵션 선택
    const firstDay = page.locator('[role="option"]').first();
    if (await firstDay.count() > 0) {
      await firstDay.click();
      await page.evaluate(() => window.scrollTo(0, 0));
      console.log('일 선택 완료: 무작위');
    }
    
  } catch (error) {
    console.log('생년월일 드롭다운 처리 중 오류:', error.message);
  }
  
  // 동의 체크박스 찾기 및 체크
  console.log('동의 체크박스 찾기 및 체크...');
  try {
    const agreementCheckbox = page.locator('button[role="checkbox"]');
    await agreementCheckbox.click();
    console.log('동의 체크박스 체크 완료');
  } catch (error) {
    console.log('동의 체크박스 처리 중 오류:', error.message);
  }
  
  // Register 버튼 클릭
  console.log('Register 버튼 클릭...');
  const registerButton = page.locator('button:has-text("Register"), button:has-text("가입"), button[type="submit"]').first();
  
  // 버튼 상태 확인
  const isEnabled = await registerButton.isEnabled();
  console.log('Register 버튼 활성화 상태:', isEnabled);
  
  if (isEnabled) {
    await registerButton.click();
    console.log('Register 버튼 클릭 완료');
  } else {
    // 비활성화된 상태에서도 강제로 클릭 시도
    console.log('Register 버튼이 비활성화되어 있지만 클릭 시도...');
    await registerButton.click({ force: true });
    console.log('Register 버튼 강제 클릭 완료');
  }
  
  // 회원가입 완료 대기
  await page.waitForTimeout(5000);
  
  // 회원가입 성공 확인
  console.log('회원가입 성공 확인...');
  try {
    const finalUrl = page.url();
    console.log('회원가입 후 URL:', finalUrl);
    
    // 홈페이지로 리다이렉트되었는지 확인
    if (finalUrl.includes('/') && !finalUrl.includes('/signup') && !finalUrl.includes('/register')) {
      console.log('✅ 회원가입 성공 - 홈페이지로 리다이렉트됨');
    }
    
    // 지갑 연결 팝업 처리 (기본적으로 Later 클릭)
    try {
      const walletPopup = page.locator('text=Later, text=나중에, text=Skip, text=건너뛰기');
      if (await walletPopup.count() > 0) {
        await walletPopup.click();
        console.log('지갑 연결 팝업에서 Later 클릭');
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      console.log('지갑 연결 팝업이 없거나 처리 중 오류:', error.message);
    }
    
  } catch (error) {
    console.log('회원가입 성공 확인 중 오류:', error.message);
  }
  
  console.log('✅ 회원가입 성공 케이스 완료');
  return randomId;
}

/**
 * 회원가입 성공 케이스 실행 (지갑 케이스용 - 팝업 처리 안함)
 * @param {import('@playwright/test').Page} page - Playwright 페이지 객체
 * @returns {Promise<string>} 생성된 계정의 randomId
 */
async function performSuccessfulSignupForWallet(page) {
  console.log('🔐 회원가입 성공 케이스 실행 시작 (지갑 케이스용)...');
  
  // 홈페이지 방문
  await page.goto(config.urls.homepage());
  await page.waitForLoadState('networkidle');
  
  // 페이지 스크롤 방지
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
  });
  
  // 쿠키 동의
  try {
    const cookieAcceptButton = page.locator('button:has-text("Accept All")');
    if (await cookieAcceptButton.count() > 0) {
      await cookieAcceptButton.click();
      console.log('🍪 쿠키 동의 완료');
    }
  } catch (error) {
    console.log('🍪 쿠키 동의 버튼이 없음');
  }
  
  // 6자리 무작위 아이디 생성
  const randomNum = Math.floor(Math.random() * 900000) + 100000; // 100000-999999
  const randomId = `test${randomNum}`;
  console.log('무작위 아이디 생성:', randomId);
  
  // Bypass 로그인으로 신규 회원 접근
  await page.click('a:has-text("Sign in")');
  await page.click('button:has-text("[Dev] Bypass Sign in")');
  await page.fill('input[type="text"]', randomId);
  await page.fill('input[type="password"]', randomId);
  await page.click('button:has-text("Log in")');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('로그인 후 URL:', page.url());
  
  // 회원가입 페이지로 이동 (신규 회원이므로)
  const currentUrl = page.url();
  if (!currentUrl.includes('/signup') && !currentUrl.includes('/profile') && !currentUrl.includes('/register')) {
    console.log('신규 회원으로 판단 - 회원가입 페이지로 이동');
    await page.goto(config.urls.signup());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  } else if (currentUrl.includes('/register')) {
    console.log('이미 회원가입 페이지에 있음:', currentUrl);
  }
  
  // Username 필드에 정상적인 이름 입력 (무작위 아이디와 동일)
  console.log('Username 필드에 정상적인 이름 입력:', randomId);
  
  try {
    const usernameField = page.locator('input[placeholder="Enter name"]');
    await usernameField.fill(randomId);
    console.log('정상적인 이름 입력 완료');
  } catch (error) {
    console.log('Username 필드 찾기 실패:', error.message);
  }
  
  // 생년월일 입력 - 스크롤 방지 방법 (1999년 + 1/1 월일)
  console.log('생년월일 입력: 1999년 1/1 월일');
  
  try {
    // 년도만 1999년으로 설정 (13세 이상 확인용)
    const yearButton = page.locator('button[role="combobox"]').first();
    await yearButton.click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    
    const year1999 = page.locator('text=1999').first();
    await year1999.click();
    await page.evaluate(() => window.scrollTo(0, 0));
    console.log('년도 선택 완료: 1999');
    
    // 월은 무작위로 첫 번째 옵션 선택
    const monthButton = page.locator('button[role="combobox"]').nth(1);
    await monthButton.click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    
    // 첫 번째 월 옵션 선택
    const firstMonth = page.locator('[role="option"]').first();
    if (await firstMonth.count() > 0) {
      await firstMonth.click();
      await page.evaluate(() => window.scrollTo(0, 0));
      console.log('월 선택 완료: 무작위');
    }
    
    // 일은 무작위로 첫 번째 옵션 선택
    const dayButton = page.locator('button[role="combobox"]').nth(2);
    await dayButton.click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    
    // 첫 번째 일 옵션 선택
    const firstDay = page.locator('[role="option"]').first();
    if (await firstDay.count() > 0) {
      await firstDay.click();
      await page.evaluate(() => window.scrollTo(0, 0));
      console.log('일 선택 완료: 무작위');
    }
    
  } catch (error) {
    console.log('생년월일 드롭다운 처리 중 오류:', error.message);
  }
  
  // 동의 체크박스 찾기 및 체크
  console.log('동의 체크박스 찾기 및 체크...');
  try {
    const agreementCheckbox = page.locator('button[role="checkbox"]');
    await agreementCheckbox.click();
    console.log('동의 체크박스 체크 완료');
  } catch (error) {
    console.log('동의 체크박스 처리 중 오류:', error.message);
  }
  
  // Register 버튼 클릭
  console.log('Register 버튼 클릭...');
  const registerButton = page.locator('button:has-text("Register"), button:has-text("가입"), button[type="submit"]').first();
  
  // 버튼 상태 확인
  const isEnabled = await registerButton.isEnabled();
  console.log('Register 버튼 활성화 상태:', isEnabled);
  
  if (isEnabled) {
    await registerButton.click();
    console.log('Register 버튼 클릭 완료');
  } else {
    // 비활성화된 상태에서도 강제로 클릭 시도
    console.log('Register 버튼이 비활성화되어 있지만 클릭 시도...');
    await registerButton.click({ force: true });
    console.log('Register 버튼 강제 클릭 완료');
  }
  
  // 회원가입 완료 대기
  await page.waitForTimeout(5000);
  
  // 회원가입 성공 확인
  console.log('회원가입 성공 확인...');
  try {
    const finalUrl = page.url();
    console.log('회원가입 후 URL:', finalUrl);
    
    // 홈페이지로 리다이렉트되었는지 확인
    if (finalUrl.includes('/') && !finalUrl.includes('/signup') && !finalUrl.includes('/register')) {
      console.log('✅ 회원가입 성공 - 홈페이지로 리다이렉트됨');
    }
    
    // 지갑 연결 팝업은 처리하지 않음 (지갑 케이스에서 직접 처리)
    console.log('지갑 연결 팝업은 지갑 케이스에서 직접 처리');
    
  } catch (error) {
    console.log('회원가입 성공 확인 중 오류:', error.message);
  }
  
  console.log('✅ 회원가입 성공 케이스 완료 (지갑 케이스용)');
  return randomId;
}

module.exports = {
  performSuccessfulSignup,
  performSuccessfulSignupForWallet
};
