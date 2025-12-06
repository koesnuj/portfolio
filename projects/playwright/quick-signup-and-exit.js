const { startOverdareApp, takeOverdareScreenshot, sendOverdareToBackground } = require('./utils/overdare-app-helper');

async function quickSignupAndExit() {
  let driver;
  
  try {
    console.log('🎮 빠른 회원가입 및 자동 종료');
    console.log('='.repeat(50));

    // 1단계: 앱 시작
    console.log('\n🔗 앱 시작');
    driver = await startOverdareApp();
    console.log('✅ 앱 시작 완료');

    // 2단계: QA 서버 선택
    console.log('\n📡 QA 서버 선택');
    const qaElement = await driver.$('//android.widget.TextView[@text="qa"]');
    if (qaElement) {
      await qaElement.click();
      console.log('✅ QA 서버 선택 완료');
    }

    // 3단계: GO 버튼 클릭
    console.log('\n🚀 GO 버튼 클릭');
    const goElement = await driver.$('//android.widget.TextView[@text="GO"]');
    if (goElement) {
      await goElement.click();
      console.log('✅ GO 버튼 클릭 완료');
    }

    // 4단계: 홈 화면 도달 확인
    console.log('\n🏠 홈 화면 도달 확인');
    await driver.pause(2000); // 2초 대기
    
    const textElements = await driver.$$('//android.widget.TextView');
    let homeFound = false;
    
    for (let element of textElements) {
      try {
        const text = await element.getText();
        if (text && (text.includes('Want first dibs') || text.includes('Sounds good'))) {
          homeFound = true;
          console.log(`✅ 홈 화면 도달: "${text}"`);
          break;
        }
      } catch (e) {
        // 무시
      }
    }
    
    if (homeFound) {
      console.log('✅ 회원가입 완료!');
    } else {
      console.log('⚠️ 홈 화면 미도달');
    }

    // 5단계: 3초 대기 후 자동 종료
    console.log('\n⏰ 3초 대기 후 자동 종료...');
    await driver.pause(3000);
    
    console.log('📱 앱 종료 중...');
    await sendOverdareToBackground(driver);
    
    console.log('✅ 자동 종료 완료!');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  } finally {
    if (driver) {
      await driver.deleteSession();
      console.log('✅ 세션 정리 완료');
    }
  }
}

// 스크립트 실행
quickSignupAndExit().catch(console.error);

