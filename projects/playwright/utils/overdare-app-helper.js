const { remote } = require('webdriverio');

// Overdare 앱 설정
const OVERDARE_CONFIG = {
  'appium:platformName': 'Android',
  'appium:deviceName': 'R3CT105TEHV', // 연결된 디바이스 ID
  'appium:appPackage': 'com.overdare.overdare.dev',
  'appium:appActivity': 'com.overdare.overdare.ui.MainActivity', // 실제 메인 액티비티
  'appium:automationName': 'UiAutomator2',
  'appium:noReset': true, // 앱 데이터 유지
  'appium:fullReset': false, // 앱 재설치하지 않음
  'appium:newCommandTimeout': 30000, // 30초 타임아웃
  'appium:platformVersion': '14', // Android 버전 (실제 디바이스 버전)
};

/**
 * Overdare 앱 세션 시작
 * @returns {Promise<import('webdriverio').RemoteWebDriver>} WebDriver 세션
 */
async function startOverdareApp() {
  console.log('🚀 Overdare 앱 시작 중...');
  
  const driver = await remote({
    hostname: 'localhost',
    port: 4723,
    path: '/',
    capabilities: OVERDARE_CONFIG
  });
  
  console.log('✅ Overdare 앱 세션 시작 완료');
  return driver;
}

/**
 * Overdare 앱 로그인 함수
 * @param {import('webdriverio').RemoteWebDriver} driver - WebDriver 세션
 * @param {Object} options - 로그인 옵션
 * @param {string} options.username - 사용자명 (기본값: test111)
 * @param {string} options.password - 비밀번호 (기본값: test111)
 */
async function loginToOverdare(driver, options = {}) {
  const { username = 'test111', password = 'test111' } = options;
  
  console.log(`🔐 Overdare 로그인 시작: ${username}`);
  
  try {
    // 앱이 이미 실행 중인지 확인
    const currentActivity = await driver.getCurrentActivity();
    console.log(`📍 현재 액티비티: ${currentActivity}`);
    
    // 로그인 관련 요소들 찾기
    const loginSelectors = [
      '//android.widget.EditText[@hint="이메일" or @hint="Email" or @hint="사용자명" or @hint="Username"]',
      '//android.widget.EditText[contains(@resource-id, "email") or contains(@resource-id, "username")]',
      '//android.widget.EditText[1]', // 첫 번째 입력 필드
      '//android.widget.EditText'
    ];
    
    // 사용자명 입력
    let usernameInput = null;
    for (const selector of loginSelectors) {
      try {
        usernameInput = await driver.$(selector);
        if (await usernameInput.isDisplayed()) {
          console.log(`✅ 사용자명 입력 필드 발견: ${selector}`);
          break;
        }
      } catch (error) {
        // 요소를 찾지 못한 경우 무시
      }
    }
    
    if (usernameInput) {
      await usernameInput.setValue(username);
      console.log('✅ 사용자명 입력 완료');
    } else {
      console.log('⚠️ 사용자명 입력 필드를 찾을 수 없음');
    }
    
    // 비밀번호 입력 필드 찾기
    const passwordSelectors = [
      '//android.widget.EditText[@password="true"]',
      '//android.widget.EditText[@hint="비밀번호" or @hint="Password"]',
      '//android.widget.EditText[contains(@resource-id, "password")]',
      '//android.widget.EditText[2]' // 두 번째 입력 필드
    ];
    
    let passwordInput = null;
    for (const selector of passwordSelectors) {
      try {
        passwordInput = await driver.$(selector);
        if (await passwordInput.isDisplayed()) {
          console.log(`✅ 비밀번호 입력 필드 발견: ${selector}`);
          break;
        }
      } catch (error) {
        // 요소를 찾지 못한 경우 무시
      }
    }
    
    if (passwordInput) {
      await passwordInput.setValue(password);
      console.log('✅ 비밀번호 입력 완료');
    } else {
      console.log('⚠️ 비밀번호 입력 필드를 찾을 수 없음');
    }
    
    // 로그인 버튼 찾기
    const loginButtonSelectors = [
      '//android.widget.Button[@text="로그인" or @text="Login" or @text="Sign In"]',
      '//android.widget.Button[contains(@resource-id, "login")]',
      '//android.widget.Button[contains(@text, "로그인")]',
      '//android.widget.Button[1]' // 첫 번째 버튼
    ];
    
    let loginButton = null;
    for (const selector of loginButtonSelectors) {
      try {
        loginButton = await driver.$(selector);
        if (await loginButton.isDisplayed()) {
          console.log(`✅ 로그인 버튼 발견: ${selector}`);
          break;
        }
      } catch (error) {
        // 요소를 찾지 못한 경우 무시
      }
    }
    
    if (loginButton) {
      await loginButton.click();
      console.log('✅ 로그인 버튼 클릭 완료');
      
      // 로그인 처리 대기
      await driver.pause(3000);
      
      // 로그인 성공 확인
      const currentActivityAfterLogin = await driver.getCurrentActivity();
      console.log(`📍 로그인 후 액티비티: ${currentActivityAfterLogin}`);
      
      console.log('✅ Overdare 로그인 완료');
    } else {
      console.log('⚠️ 로그인 버튼을 찾을 수 없음');
    }
    
  } catch (error) {
    console.log('❌ 로그인 중 오류 발생:', error.message);
    throw error;
  }
}

/**
 * Overdare 앱 스크린샷 저장
 * @param {import('webdriverio').RemoteWebDriver} driver - WebDriver 세션
 * @param {string} filename - 파일명
 */
async function takeOverdareScreenshot(driver, filename) {
  try {
    const screenshot = await driver.takeScreenshot();
    const fs = require('fs');
    const path = require('path');
    
    const screenshotPath = path.join(__dirname, '..', 'screenshots', `${filename}.png`);
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    
    console.log(`📸 스크린샷 저장: ${screenshotPath}`);
  } catch (error) {
    console.log('❌ 스크린샷 저장 실패:', error.message);
  }
}

/**
 * Overdare 앱을 백그라운드로 보내고 완전히 종료
 * @param {import('webdriverio').RemoteWebDriver} driver - WebDriver 세션
 */
async function sendOverdareToBackground(driver) {
  try {
    // 1. 앱을 백그라운드로 보내기
    await driver.background(2); // 2초간 백그라운드로 보내기
    console.log('✅ Overdare 앱을 백그라운드로 전송 완료');
    
    // 2. 3초 대기 (앱이 완전히 백그라운드로 이동할 시간 확보)
    console.log('⏰ 3초 대기 중... (앱 백그라운드 이동 완료 대기)');
    await driver.pause(3000);
    
    // 3. 앱 완전히 종료
    await driver.terminateApp('com.overdare.overdare.dev');
    console.log('✅ Overdare 앱 완전 종료 완료');
    
  } catch (error) {
    console.log('❌ 백그라운드 전송 및 종료 중 오류:', error.message);
  }
}

/**
 * Overdare 앱 세션 종료
 * @param {import('webdriverio').RemoteWebDriver} driver - WebDriver 세션
 */
async function closeOverdareApp(driver) {
  try {
    await driver.deleteSession();
    console.log('✅ Overdare 앱 세션 종료 완료');
  } catch (error) {
    console.log('❌ 세션 종료 중 오류:', error.message);
  }
}

module.exports = {
  startOverdareApp,
  loginToOverdare,
  takeOverdareScreenshot,
  sendOverdareToBackground,
  closeOverdareApp,
  OVERDARE_CONFIG
};
