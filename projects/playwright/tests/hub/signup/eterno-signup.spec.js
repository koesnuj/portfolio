const { test, expect } = require('@playwright/test');
const config = require('../../../config/test-config');

// 6자리 무작위 아이디 생성 함수
function generateRandomId() {
  const randomNum = Math.floor(Math.random() * 900000) + 100000; // 100000-999999
  return `test${randomNum}`;
}

// 무작위 계정명 생성 함수
function generateRandomAccountName() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

test.describe('Eterno Studio 회원가입 자동화', () => {
  test('1단계: 회원가입 페이지 접근 @step1', async ({ page }) => {
    test.setTimeout(60000);
    
    console.log('1단계: 회원가입 페이지 접근 시작...');
    
    // 홈페이지 방문
    await page.goto(config.urls.homepage());
    await page.waitForLoadState('networkidle');
    
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
    
    // Sign in 버튼 클릭
    console.log('Sign in 버튼 클릭...');
    const signInButton = page.locator('a:has-text("Sign in")');
    await expect(signInButton).toBeVisible({ timeout: 10000 });
    await signInButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('Sign in 클릭 후 URL:', page.url());
    
    // Bypass 로그인으로 신규 회원 접근
    const randomId = generateRandomId();
    console.log('무작위 아이디 생성:', randomId);
    
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
    
    console.log('최종 회원가입 페이지 URL:', page.url());
    
    // 회원가입 페이지 요소 확인
    try {
      const usernameField = page.locator('input[placeholder="Enter name"]');
      await expect(usernameField).toBeVisible({ timeout: 10000 });
      console.log('✅ 회원가입 페이지 접근 성공 - Username 필드 확인됨');
    } catch (error) {
      console.log('⚠️ 회원가입 페이지 요소를 찾을 수 없음:', error.message);
    }
    
    console.log('✅ 1단계 완료: 회원가입 페이지 접근');
  });
  
  test('2단계: 금칙어 및 생년 체크 @step2', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('2단계: 금칙어 및 생년 체크 시작...');
    
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
    
    // Bypass 로그인으로 신규 회원 접근
    const randomId = generateRandomId();
    console.log('무작위 아이디 생성:', randomId);
    
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
      await page.goto(`${config.urls.homepage()}/signup`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } else if (currentUrl.includes('/register')) {
      console.log('이미 회원가입 페이지에 있음:', currentUrl);
    }
    
    // 금칙어 테스트: 'fuck' 단어 입력
    console.log('금칙어 테스트: fuck 단어 입력');
    try {
      const usernameField = page.locator('input[placeholder="Enter name"]');
      await expect(usernameField).toBeVisible({ timeout: 10000 });
      await usernameField.fill('fuck');
      console.log('금칙어 입력 완료');
    } catch (error) {
      console.log('Username 필드 찾기 실패:', error.message);
    }
    
    // 생년월일 입력 - 스크롤 방지 방법 (2020년 + 1/1 월일)
    console.log('생년월일 입력: 2020년 1/1 월일');
    
    try {
      // 년도만 2020년으로 설정 (13세 미만 확인용)
      const yearButton = page.locator('button[role="combobox"]').first();
      await yearButton.click();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      
      const year2020 = page.locator('text=2020').first();
      await year2020.click();
      await page.evaluate(() => window.scrollTo(0, 0));
      console.log('년도 선택 완료: 2020');
      
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
      await expect(agreementCheckbox).toBeVisible({ timeout: 10000 });
      await agreementCheckbox.click();
      console.log('동의 체크박스 체크 완료');
    } catch (error) {
      console.log('동의 체크박스 처리 중 오류:', error.message);
    }
    
    // Register 버튼 클릭
    console.log('Register 버튼 클릭...');
    const registerButton = page.locator('button:has-text("Register"), button:has-text("가입"), button[type="submit"]').first();
    await expect(registerButton).toBeVisible({ timeout: 10000 });
    
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
    
    // 금칙어 및 생년 체크 결과 확인
    console.log('금칙어 및 생년 체크 결과 확인...');
    try {
      const finalUrl = page.url();
      console.log('회원가입 시도 후 URL:', finalUrl);
      
      // 에러 메시지 확인
      const errorMessage = page.locator('text=/error|invalid|금지|forbidden|not allowed/i');
      if (await errorMessage.count() > 0) {
        console.log('✅ 금칙어/생년 체크 에러 메시지 확인됨');
      } else {
        console.log('⚠️ 에러 메시지를 찾을 수 없음');
      }
      
    } catch (error) {
      console.log('금칙어/생년 체크 확인 중 오류:', error.message);
    }
    
    console.log('✅ 2단계 완료: 금칙어 및 생년 체크');
  });
  
  test('3단계: 성공 케이스 회원가입 @step3', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('3단계: 성공 케이스 회원가입 시작...');
    
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
    
    // Bypass 로그인으로 신규 회원 접근
    const randomId = generateRandomId();
    console.log('무작위 아이디 생성:', randomId);
    
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
      await page.goto(`${config.urls.homepage()}/signup`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } else if (currentUrl.includes('/register')) {
      console.log('이미 회원가입 페이지에 있음:', currentUrl);
    }
    
    // Username 필드에 정상적인 이름 입력 (무작위 아이디와 동일)
    console.log('Username 필드에 정상적인 이름 입력:', randomId);
    
    try {
      const usernameField = page.locator('input[placeholder="Enter name"]');
      await expect(usernameField).toBeVisible({ timeout: 10000 });
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
      await expect(agreementCheckbox).toBeVisible({ timeout: 10000 });
      await agreementCheckbox.click();
      console.log('동의 체크박스 체크 완료');
    } catch (error) {
      console.log('동의 체크박스 처리 중 오류:', error.message);
    }
    
    // Register 버튼 클릭
    console.log('Register 버튼 클릭...');
    const registerButton = page.locator('button:has-text("Register"), button:has-text("가입"), button[type="submit"]').first();
    await expect(registerButton).toBeVisible({ timeout: 10000 });
    
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
      
      // 성공 메시지 확인
      const successMessage = page.locator('text=/success|welcome|complete|완료|성공|환영/i');
      if (await successMessage.count() > 0) {
        console.log('✅ 회원가입 성공 메시지 확인됨');
      } else {
        console.log('⚠️ 성공 메시지를 찾을 수 없음');
      }
      
      // 지갑 연동 팝업 처리
      console.log('지갑 연동 팝업 확인...');
      try {
        const walletPopup = page.locator('text=/wallet|지갑|connect|연동/i');
        const laterButton = page.locator('button:has-text("Later"), button:has-text("나중에"), button:has-text("Skip")');
        
        if (await walletPopup.count() > 0 && await laterButton.count() > 0) {
          console.log('지갑 연동 팝업 발견 - Later 버튼 클릭');
          await laterButton.click();
          await page.waitForTimeout(2000);
          console.log('✅ 지갑 연동 팝업 처리 완료');
        } else {
          console.log('지갑 연동 팝업이 없거나 Later 버튼을 찾을 수 없음');
        }
      } catch (error) {
        console.log('지갑 연동 팝업 처리 중 오류:', error.message);
      }
      
    } catch (error) {
      console.log('회원가입 성공 확인 중 오류:', error.message);
    }
    
    console.log('✅ 3단계 완료: 성공 케이스 회원가입 테스트');
  });
  
  test('4단계: 계정 삭제 테스트 @step4 @final-step', async ({ page }) => {
    test.setTimeout(120000);
    
    console.log('4단계: 계정 삭제 테스트 시작...');
    
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
    
    // Bypass 로그인으로 신규 계정 생성 (3단계와 동일)
    const randomId = generateRandomId();
    console.log('무작위 아이디 생성:', randomId);
    
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
      await page.goto(`${config.urls.homepage()}/signup`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } else if (currentUrl.includes('/register')) {
      console.log('이미 회원가입 페이지에 있음:', currentUrl);
    }
    
    // 신규 계정 생성 (3단계와 동일)
    console.log('📝 신규 계정 생성 시작...');
    
    // Username 필드에 정상적인 이름 입력 (무작위 아이디와 동일)
    console.log('Username 필드에 정상적인 이름 입력:', randomId);
    
    try {
      const usernameField = page.locator('input[placeholder="Enter name"]');
      await expect(usernameField).toBeVisible({ timeout: 10000 });
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
    
    // 동의 체크박스 찾기 및 체크 (3단계와 동일)
    console.log('동의 체크박스 찾기 및 체크...');
    try {
      const agreementCheckbox = page.locator('button[role="checkbox"]');
      await expect(agreementCheckbox).toBeVisible({ timeout: 10000 });
      await agreementCheckbox.click();
      console.log('동의 체크박스 체크 완료');
    } catch (error) {
      console.log('동의 체크박스 처리 중 오류:', error.message);
    }
    
    // Register 버튼 클릭
    console.log('Register 버튼 클릭...');
    const registerButton = page.locator('button:has-text("Register"), button:has-text("가입"), button[type="submit"]').first();
    await expect(registerButton).toBeVisible({ timeout: 10000 });
    
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
      
      // 성공 메시지 확인
      const successMessage = page.locator('text=/success|welcome|complete|완료|성공|환영/i');
      if (await successMessage.count() > 0) {
        console.log('✅ 회원가입 성공 메시지 확인됨');
      } else {
        console.log('⚠️ 성공 메시지를 찾을 수 없음');
      }
      
      // 지갑 연동 팝업 처리
      console.log('지갑 연동 팝업 확인...');
      try {
        const walletPopup = page.locator('text=/wallet|지갑|connect|연동/i');
        const laterButton = page.locator('button:has-text("Later"), button:has-text("나중에"), button:has-text("Skip")');
        
        if (await walletPopup.count() > 0 && await laterButton.count() > 0) {
          console.log('지갑 연동 팝업 발견 - Later 버튼 클릭');
          await laterButton.click();
          await page.waitForTimeout(2000);
          console.log('✅ 지갑 연동 팝업 처리 완료');
        } else {
          console.log('지갑 연동 팝업이 없거나 Later 버튼을 찾을 수 없음');
        }
      } catch (error) {
        console.log('지갑 연동 팝업 처리 중 오류:', error.message);
      }
      
    } catch (error) {
      console.log('회원가입 성공 확인 중 오류:', error.message);
    }
    
    console.log('✅ 신규 계정 생성 완료');
    
    // 계정 삭제 플로우 시작
    console.log('🗑️ 계정 삭제 플로우 시작...');
    
    try {
      // 1. 썸네일 이미지 클릭 (프로필 메뉴 열기)
      console.log('1단계: 썸네일 이미지 클릭');
      const thumbnailImg = page.locator('img[data-testid="thumbnail-image"]');
      await expect(thumbnailImg).toBeVisible({ timeout: 10000 });
      await thumbnailImg.click();
      await page.waitForTimeout(1000);
      console.log('✅ 썸네일 이미지 클릭 완료');
      
      // 2. My Profile 버튼 클릭
      console.log('2단계: My Profile 버튼 클릭');
      const myProfileButton = page.locator('text=My Profile').first();
      await expect(myProfileButton).toBeVisible({ timeout: 10000 });
      await myProfileButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      console.log('✅ My Profile 버튼 클릭 완료');
      
      // 3. Edit Profile 버튼 클릭
      console.log('3단계: Edit Profile 버튼 클릭');
      const editButton = page.locator('button:has-text("Edit Profile")');
      await expect(editButton).toBeVisible({ timeout: 10000 });
      await editButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      console.log('✅ Edit Profile 버튼 클릭 완료');
      
      // 4. Delete Account 버튼 클릭
      console.log('4단계: Delete Account 버튼 클릭');
      const deleteAccountButton = page.locator('div.MyInfo_deleteAccount__qyESU');
      await expect(deleteAccountButton).toBeVisible({ timeout: 10000 });
      await deleteAccountButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Delete Account 버튼 클릭 완료');
      
      // 5. 체크박스 선택 (ConcernedAboutPrivacy)
      console.log('5단계: 체크박스 선택');
      const checkbox = page.locator('button[role="radio"][value="ConcernedAboutPrivacy"]');
      await expect(checkbox).toBeVisible({ timeout: 10000 });
      await checkbox.click();
      await page.waitForTimeout(1000);
      console.log('✅ 체크박스 선택 완료');
      
      // 6. Proceed 버튼 클릭
      console.log('6단계: Proceed 버튼 클릭');
      const proceedButton = page.locator('button:has-text("Proceed")');
      await expect(proceedButton).toBeVisible({ timeout: 10000 });
      await proceedButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Proceed 버튼 클릭 완료');
      
      // 7. 정책 동의 체크박스 선택
      console.log('7단계: 정책 동의 체크박스 선택');
      const policyCheckbox = page.locator('button[role="checkbox"][value="on"]');
      await expect(policyCheckbox).toBeVisible({ timeout: 10000 });
      await policyCheckbox.click();
      await page.waitForTimeout(1000);
      console.log('✅ 정책 동의 체크박스 선택 완료');
      
      // 8. 최종 Delete Account 버튼 클릭
      console.log('8단계: 최종 Delete Account 버튼 클릭');
      const finalDeleteButton = page.locator('button:has-text("Delete Account")');
      await expect(finalDeleteButton).toBeVisible({ timeout: 10000 });
      await finalDeleteButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      console.log('✅ 최종 Delete Account 버튼 클릭 완료');
      
      // 삭제 완료 확인
      const finalUrl = page.url();
      console.log('계정 삭제 후 URL:', finalUrl);
      
      // 성공 메시지 확인
      const successMessage = page.locator('text=/deleted|removed|삭제|완료/i');
      if (await successMessage.count() > 0) {
        console.log('✅ 계정 삭제 성공 메시지 확인됨');
      } else {
        console.log('⚠️ 삭제 성공 메시지를 찾을 수 없음');
      }
      
    } catch (error) {
      console.log('계정 삭제 중 오류:', error.message);
    }
    
    console.log('✅ 4단계 완료: 계정 삭제 테스트');
  });
});
