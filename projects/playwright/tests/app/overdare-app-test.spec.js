const { test, expect } = require('@playwright/test');
const { startOverdareApp, loginToOverdare, takeOverdareScreenshot, sendOverdareToBackground } = require('../../utils/overdare-app-helper');

test.describe('Overdare 앱 테스트', () => {
  let driver;

  test.beforeAll(async () => {
    // Appium 서버가 실행 중인지 확인
    console.log('🔍 Appium 서버 연결 확인 중...');
    driver = await startOverdareApp();
  });

  test.afterAll(async () => {
    if (driver) {
      await sendOverdareToBackground(driver);
      await driver.deleteSession();
    }
  });

  test('Overdare 앱 실행 테스트 @step1', async () => {
    console.log('📱 Overdare 앱 실행 테스트 시작');
    
    // 앱이 실행되었는지 확인
    const currentActivity = await driver.getCurrentActivity();
    console.log(`📍 현재 액티비티: ${currentActivity}`);
    
    // 앱 제목 확인
    try {
      const appTitle = await driver.$('//android.widget.TextView[1]');
      const titleText = await appTitle.getText();
      console.log(`📱 앱 제목: ${titleText}`);
    } catch (error) {
      console.log('ℹ️ 앱 제목을 찾을 수 없음');
    }
    
    // 스크린샷 저장
    await takeOverdareScreenshot(driver, 'overdare-app-launch');
    
    console.log('✅ Overdare 앱 실행 테스트 완료');
  });

  test('Overdare 앱 로그인 테스트 @step2', async () => {
    console.log('🔐 Overdare 앱 로그인 테스트 시작');
    
    // 로그인 시도
    await loginToOverdare(driver, {
      username: 'test111',
      password: 'test111'
    });
    
    // 로그인 후 스크린샷 저장
    await takeOverdareScreenshot(driver, 'overdare-login-success');
    
    console.log('✅ Overdare 앱 로그인 테스트 완료');
  });

  test('Overdare 앱 메인 화면 확인 @step3', async () => {
    console.log('🏠 Overdare 앱 메인 화면 확인 시작');
    
    // 현재 화면의 요소들 확인
    try {
      const elements = await driver.$$('//android.widget.TextView');
      console.log(`📱 화면에 ${elements.length}개의 텍스트 요소 발견`);
      
      for (let i = 0; i < Math.min(elements.length, 5); i++) {
        try {
          const text = await elements[i].getText();
          console.log(`📝 텍스트 ${i + 1}: ${text}`);
        } catch (error) {
          // 텍스트를 가져올 수 없는 경우 무시
        }
      }
    } catch (error) {
      console.log('ℹ️ 텍스트 요소를 찾을 수 없음');
    }
    
    // 버튼 요소들 확인
    try {
      const buttons = await driver.$$('//android.widget.Button');
      console.log(`🔘 화면에 ${buttons.length}개의 버튼 요소 발견`);
    } catch (error) {
      console.log('ℹ️ 버튼 요소를 찾을 수 없음');
    }
    
    // 스크린샷 저장
    await takeOverdareScreenshot(driver, 'overdare-main-screen');
    
    console.log('✅ Overdare 앱 메인 화면 확인 완료');
  });

  test('Overdare 앱 네비게이션 테스트 @step4', async () => {
    console.log('🧭 Overdare 앱 네비게이션 테스트 시작');
    
    // 네비게이션 관련 요소들 찾기
    const navSelectors = [
      '//android.widget.ImageButton',
      '//android.widget.Button[contains(@text, "메뉴") or contains(@text, "Menu")]',
      '//android.widget.Button[contains(@text, "설정") or contains(@text, "Settings")]',
      '//android.widget.Button[contains(@text, "프로필") or contains(@text, "Profile")]'
    ];
    
    let foundNav = false;
    for (const selector of navSelectors) {
      try {
        const element = await driver.$(selector);
        if (await element.isDisplayed()) {
          const text = await element.getText();
          console.log(`✅ 네비게이션 요소 발견: ${selector} - "${text}"`);
          foundNav = true;
          
          // 클릭해보기 (안전하게)
          try {
            await element.click();
            await driver.pause(1000);
            console.log('✅ 네비게이션 요소 클릭 성공');
            
            // 스크린샷 저장
            await takeOverdareScreenshot(driver, `overdare-nav-${Date.now()}`);
            
            // 뒤로가기
            await driver.back();
            await driver.pause(1000);
            break;
          } catch (error) {
            console.log('ℹ️ 네비게이션 요소 클릭 실패:', error.message);
          }
        }
      } catch (error) {
        // 요소를 찾지 못한 경우 무시
      }
    }
    
    if (!foundNav) {
      console.log('ℹ️ 네비게이션 요소를 찾을 수 없음');
    }
    
    console.log('✅ Overdare 앱 네비게이션 테스트 완료');
  });
});