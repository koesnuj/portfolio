const { startOverdareApp, takeOverdareScreenshot, sendOverdareToBackground } = require('./utils/overdare-app-helper');

async function unlockPhoneAndStartTest() {
  let driver;
  
  try {
    console.log('🔓 테스트 폰 잠금 해제 및 테스트 시작');
    
    // 앱 실행 (잠금 화면에서 시작)
    driver = await startOverdareApp();
    
    // 로딩 대기
    console.log('\n⏰ 잠금 화면 로딩 대기 중...');
    await driver.pause(3000);
    
    // 현재 화면 확인
    console.log('\n📱 현재 화면 확인...');
    const currentActivity = await driver.getCurrentActivity();
    console.log(`📍 현재 액티비티: ${currentActivity}`);
    await takeOverdareScreenshot(driver, 'locked-screen.png');
    
    // 잠금 화면인지 확인
    console.log('\n🔍 잠금 화면 요소 분석...');
    const textElements = await driver.$$('//android.widget.TextView');
    console.log(`📝 현재 화면의 텍스트 요소 ${textElements.length}개:`);
    
    for (let i = 0; i < textElements.length; i++) {
      try {
        const text = await textElements[i].getText();
        if (text && text.trim()) {
          console.log(`  ${i + 1}. "${text}"`);
        }
      } catch (e) {
        // 텍스트를 읽을 수 없는 경우 무시
      }
    }
    
    // 숫자 패드 요소 찾기
    const clickableElements = await driver.$$('//*[@clickable="true"]');
    console.log(`\n👆 클릭 가능한 요소 ${clickableElements.length}개:`);
    
    for (let i = 0; i < Math.min(clickableElements.length, 20); i++) {
      try {
        const text = await clickableElements[i].getText();
        const className = await clickableElements[i].getAttribute('className');
        const contentDesc = await clickableElements[i].getAttribute('content-desc');
        if (text && text.trim()) {
          console.log(`  ${i + 1}. "${text}" (${className}) - 설명: "${contentDesc}"`);
        }
      } catch (e) {
        // 속성을 읽을 수 없는 경우 무시
      }
    }
    
    // 비밀번호 "0000" 입력
    console.log('\n🔑 비밀번호 "0000" 입력 중...');
    try {
      // 숫자 0 버튼 찾기 및 클릭 (4번)
      for (let i = 0; i < 4; i++) {
        // 숫자 0 버튼 찾기
        const zeroButton = await driver.$('//android.widget.TextView[@text="0"]');
        if (zeroButton && await zeroButton.isDisplayed()) {
          await zeroButton.click();
          console.log(`✅ 숫자 0 클릭 (${i + 1}/4)`);
          await driver.pause(500);
        } else {
          console.log(`⚠️ 숫자 0 버튼을 찾을 수 없음 (${i + 1}/4)`);
        }
      }
      
      // 확인 버튼 클릭 (있다면)
      try {
        const confirmButton = await driver.$('//android.widget.TextView[@text="확인"]');
        if (confirmButton && await confirmButton.isDisplayed()) {
          await confirmButton.click();
          console.log('✅ 확인 버튼 클릭');
        }
      } catch (e) {
        console.log('⚠️ 확인 버튼을 찾을 수 없음');
      }
      
      // 엔터 키 입력 (있다면)
      try {
        await driver.pressKeyCode(66); // KEYCODE_ENTER
        console.log('✅ 엔터 키 입력');
      } catch (e) {
        console.log('⚠️ 엔터 키 입력 실패');
      }
      
      await driver.pause(3000); // 잠금 해제 대기
      await takeOverdareScreenshot(driver, 'after-unlock.png');
      
    } catch (error) {
      console.log('❌ 비밀번호 입력 실패:', error.message);
    }
    
    // 잠금 해제 후 화면 확인
    console.log('\n📱 잠금 해제 후 화면 확인...');
    try {
      const finalActivity = await driver.getCurrentActivity();
      console.log(`📍 최종 액티비티: ${finalActivity}`);
      
      const finalTextElements = await driver.$$('//android.widget.TextView');
      console.log(`📝 현재 화면의 텍스트 요소 ${finalTextElements.length}개:`);
      
      for (let i = 0; i < Math.min(finalTextElements.length, 10); i++) {
        try {
          const text = await finalTextElements[i].getText();
          if (text && text.trim()) {
            console.log(`  ${i + 1}. "${text}"`);
          }
        } catch (e) {
          // 텍스트를 읽을 수 없는 경우 무시
        }
      }
      
      await takeOverdareScreenshot(driver, 'final-unlocked-screen.png');
      
    } catch (error) {
      console.log('❌ 화면 확인 실패:', error.message);
    }
    
    console.log('\n🎉 잠금 해제 완료!');
    console.log('💡 이제 홈 화면에서 Overdare 앱을 실행할 수 있습니다.');
    
  } catch (error) {
    console.error('❌ 잠금 해제 중 오류 발생:', error.message);
  } finally {
    if (driver) {
      console.log('\n📱 앱을 백그라운드로 전송 중...');
      await sendOverdareToBackground(driver);
      await driver.deleteSession();
      console.log('✅ 세션 정리 완료');
    }
  }
}

// 잠금 해제 및 테스트 시작
unlockPhoneAndStartTest().catch(console.error);

