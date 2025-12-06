const { test, expect } = require('@playwright/test');
const { startOverdareApp, takeOverdareScreenshot, sendOverdareToBackground } = require('../../utils/overdare-app-helper');

// 0단계: 디바이스 잠금 해제 함수
async function unlockDeviceIfNeeded(driver) {
  console.log('🔓 0단계: 디바이스 잠금 상태 확인 중...');
  
  try {
    // 현재 화면의 텍스트 요소들 확인
    const textElements = await driver.$$('//android.widget.TextView');
    let isLocked = false;
    
    for (let element of textElements) {
      try {
        const text = await element.getText();
        if (text && (text.includes('PIN을 입력하세요') || text.includes('비밀번호') || text.includes('잠금'))) {
          isLocked = true;
          console.log('🔒 디바이스가 잠겨있습니다. 잠금 해제를 시작합니다...');
          break;
        }
      } catch (e) {
        // 무시
      }
    }
    
    if (isLocked) {
      console.log('🔑 비밀번호 "0000" 입력 중...');
      
      // 0 버튼을 4번 클릭
      for (let i = 0; i < 4; i++) {
        const zeroElement = await driver.$('//android.widget.TextView[@text="0"]');
        if (zeroElement) {
          await zeroElement.click();
          console.log(`✅ 숫자 0 클릭 (${i + 1}/4)`);
          await driver.pause(500);
        }
      }
      
      // 엔터 키 입력
      await driver.pressKeyCode(66);
      console.log('✅ 엔터 키 입력');
      
      // 잠금 해제 대기
      await driver.pause(3000);
      console.log('🎉 디바이스 잠금 해제 완료!');
    } else {
      console.log('✅ 디바이스가 이미 잠금 해제되어 있습니다.');
    }
    
  } catch (error) {
    console.log('⚠️ 잠금 상태 확인 중 오류:', error.message);
  }
}

test.describe('Overdare 회원가입 테스트', () => {
  let driver;

  test.beforeAll(async () => {
    console.log('🔍 Appium 서버 연결 확인 중...');
    driver = await startOverdareApp();
  });

  test.afterAll(async () => {
    if (driver) {
      await sendOverdareToBackground(driver);
      await driver.deleteSession();
    }
  });

  test('앱 실행 후 게스트 회원가입 @step1', async () => {
    test.setTimeout(60000); // 60초 타임아웃 설정
    console.log('🚀 1단계: 앱 실행 후 게스트 회원가입 테스트 시작');
    
    // 백그라운드에 있는 Overdare 앱 강제 종료
    console.log('🔄 백그라운드 Overdare 앱 강제 종료 중...');
    try {
      await driver.terminateApp('com.overdare.overdare.dev');
      console.log('✅ 백그라운드 Overdare 앱 강제 종료 완료');
      await driver.pause(2000);
    } catch (error) {
      console.log('⚠️ 앱 종료 중 오류:', error.message);
    }
    
    // 앱 데이터 초기화 (1단계에서 깨끗한 상태로 시작)
    console.log('🔄 앱 데이터 초기화 중...');
    await driver.execute('mobile: clearApp', { appId: 'com.overdare.overdare.dev' });
    console.log('✅ 앱 데이터 초기화 완료');
    await driver.pause(2000);
    
    // 0단계: 디바이스 잠금 해제 (1단계 내부에 포함)
    await unlockDeviceIfNeeded(driver);
    
    // 앱 실행
    console.log('🚀 Overdare 앱 실행 중...');
    await driver.activateApp('com.overdare.overdare.dev');
    await driver.pause(3000);
    console.log('✅ Overdare 앱 실행 완료');
    
    // 1단계: 실제 회원가입 플로우 시작
    console.log('📡 1단계: QA 서버 선택');
    
    // QA 서버 선택
    const qaElement = await driver.$('//android.widget.TextView[@text="qa"]');
    if (qaElement) {
      await qaElement.click();
      console.log('✅ QA 서버 선택 완료');
    }

    // GO 버튼 클릭
    const goElement = await driver.$('//android.widget.TextView[@text="GO"]');
    if (goElement) {
      await goElement.click();
      console.log('✅ GO 버튼 클릭 완료');
    }

    // 2초 대기 후 화면 확인
    await driver.pause(2000);
    
    // START 버튼 찾기 및 클릭
    console.log('🔍 START 버튼 찾는 중...');
    const startElement = await driver.$('//android.widget.TextView[@text="START"]');
    if (startElement) {
      await startElement.click();
      console.log('✅ START 버튼 클릭 완료');
      
      // 슬라이더 조작
      console.log('🎚️ 슬라이더 조작 중...');
      const sliderElement = await driver.$('//android.widget.SeekBar');
      if (sliderElement) {
        try {
          // 방법 1: mobile: swipeGesture 사용
          await driver.execute('mobile: swipeGesture', {
            elementId: sliderElement.elementId,
            direction: 'right',
            percent: 0.3
          });
          console.log('✅ 슬라이더 오른쪽으로 스와이프 완료');
        } catch (error1) {
          console.log('⚠️ swipeGesture 실패, 다른 방법 시도:', error1.message);
          
          try {
            // 방법 2: mobile: scroll 사용
            await driver.execute('mobile: scroll', {
              elementId: sliderElement.elementId,
              direction: 'right',
              percent: 0.3
            });
            console.log('✅ 슬라이더 스크롤 완료');
          } catch (error2) {
            console.log('⚠️ scroll 실패, 터치 액션 시도:', error2.message);
            
            try {
              // 방법 3: 직접 터치 좌표 사용
              await driver.touchAction([
                { action: 'press', x: 200, y: 800 },
                { action: 'wait', ms: 500 },
                { action: 'moveTo', x: 400, y: 800 },
                { action: 'release' }
              ]);
              console.log('✅ 슬라이더 터치 드래그 완료');
            } catch (error3) {
              console.log('⚠️ 모든 방법 실패, 클릭으로 대체:', error3.message);
              await sliderElement.click();
              console.log('✅ 슬라이더 클릭 완료');
            }
          }
        }
      }

      // OK 버튼 클릭
      console.log('👆 OK 버튼 클릭 중...');
      const okElement = await driver.$('//android.widget.TextView[@text="OK"]');
      if (okElement) {
        await okElement.click();
        console.log('✅ OK 버튼 클릭 완료');
      }
    } else {
      console.log('⚠️ START 버튼을 찾을 수 없습니다.');
    }

    // Android 시스템 알림 허용 모달창 처리
    console.log('🔔 Android 시스템 알림 허용 모달창 확인 중...');
    await driver.pause(3000);
    
    try {
      // Android 시스템 모달창의 다양한 허용 버튼 찾기
      const allowSelectors = [
        '//android.widget.Button[@text="Allow"]',
        '//android.widget.Button[@text="허용"]', 
        '//android.widget.Button[@text="Allow notifications"]',
        '//android.widget.Button[@text="알림 허용"]',
        '//android.widget.Button[contains(@text, "Allow")]',
        '//android.widget.Button[contains(@text, "허용")]',
        '//android.widget.TextView[@text="Allow"]',
        '//android.widget.TextView[@text="허용"]',
        '//android.widget.TextView[contains(@text, "Allow")]',
        '//android.widget.TextView[contains(@text, "허용")]'
      ];
      
      let allowButtonFound = false;
      for (const selector of allowSelectors) {
        try {
          const allowButton = await driver.$(selector);
          if (allowButton && await allowButton.isDisplayed()) {
            await allowButton.click();
            console.log(`✅ 알림 허용 버튼 클릭 완료: ${selector}`);
            allowButtonFound = true;
            await driver.pause(2000);
            break;
          }
        } catch (e) {
          // 무시하고 다음 셀렉터 시도
        }
      }
      
      if (!allowButtonFound) {
        console.log('ℹ️ Android 시스템 알림 허용 버튼을 찾을 수 없음');
      }
    } catch (error) {
      console.log('ℹ️ Android 시스템 알림 허용 처리 중 오류:', error.message);
    }

    // 홈 화면 도달 확인
    console.log('🏠 홈 화면 도달 확인 중...');
    await driver.pause(3000);
    
    const textElements = await driver.$$('//android.widget.TextView');
    let homeFound = false;
    
    for (let element of textElements) {
      try {
        const text = await element.getText();
        if (text && (text.includes('Want first dibs') || text.includes('Sounds good') || text.includes('Get notified about special offers'))) {
          homeFound = true;
          console.log(`✅ 홈 화면 도달: "${text}"`);
          break;
        }
      } catch (e) {
        // 무시
      }
    }
    
    if (homeFound) {
      console.log('✅ 1단계 회원가입 완료!');
    } else {
      console.log('⚠️ 홈 화면 미도달');
    }

    // 3초 대기 후 자동 종료
    console.log('⏰ 3초 대기 후 자동 종료...');
    await driver.pause(3000);
    
    console.log('📱 앱 종료 중...');
    await sendOverdareToBackground(driver);
    
    console.log('✅ 1단계 자동 종료 완료!');
  });

  test('로그인된 계정으로 홈 진입 @step2', async () => {
    console.log('🚀 2단계: 로그인된 계정으로 홈 진입 테스트 시작');
    
    // 백그라운드에 있는 Overdare 앱 강제 종료
    console.log('🔄 백그라운드 Overdare 앱 강제 종료 중...');
    try {
      await driver.terminateApp('com.overdare.overdare.dev');
      console.log('✅ 백그라운드 Overdare 앱 강제 종료 완료');
      await driver.pause(2000);
    } catch (error) {
      console.log('⚠️ 앱 종료 중 오류:', error.message);
    }
    
    // 0단계: 디바이스 잠금 해제 (2단계 내부에 포함)
    await unlockDeviceIfNeeded(driver);
    
    // 앱 실행
    console.log('🚀 Overdare 앱 실행 중...');
    await driver.activateApp('com.overdare.overdare.dev');
    await driver.pause(3000);
    console.log('✅ Overdare 앱 실행 완료');
    
    // 2단계: 이미 로그인된 상태에서 회원가입 플로우
    console.log('📡 2단계: QA 서버 선택');
    
    // QA 서버 선택
    const qaElement = await driver.$('//android.widget.TextView[@text="qa"]');
    if (qaElement) {
      await qaElement.click();
      console.log('✅ QA 서버 선택 완료');
    }

    // GO 버튼 클릭
    const goElement = await driver.$('//android.widget.TextView[@text="GO"]');
    if (goElement) {
      await goElement.click();
      console.log('✅ GO 버튼 클릭 완료');
    }

    // 2초 대기 후 화면 확인
    await driver.pause(2000);
    
    // START 버튼이 있는지 확인 (이미 로그인된 상태라면 없어야 함)
    const startElement = await driver.$('//android.widget.TextView[@text="START"]');
    if (startElement) {
      console.log('⚠️ START 버튼이 발견되었습니다. 이미 로그인된 상태가 아닙니다.');
      
      // START 버튼 클릭하여 회원가입 진행
      await startElement.click();
      console.log('✅ START 버튼 클릭 완료');
      
      // 슬라이더 조작
      const sliderElement = await driver.$('//android.widget.SeekBar');
      if (sliderElement) {
        await sliderElement.click();
        console.log('✅ 슬라이더 조작 완료');
      }

      // OK 버튼 클릭
      const okElement = await driver.$('//android.widget.TextView[@text="OK"]');
      if (okElement) {
        await okElement.click();
        console.log('✅ OK 버튼 클릭 완료');
      }
    } else {
      console.log('✅ START 버튼이 없습니다. 이미 로그인된 상태입니다.');
    }

    // 홈 화면 도달 확인
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
      console.log('✅ 2단계 테스트 완료!');
    } else {
      console.log('⚠️ 홈 화면 미도달');
    }

    // 스크린샷 저장
    await takeOverdareScreenshot(driver, 'signup-from-running-complete');
    
    console.log('✅ 2단계: 이미 로그인된 상태에서 회원가입 테스트 완료');
  });

  test('앱 초기화 후 회원가입 @step3', async () => {
    console.log('🚀 3단계: 앱 초기화 후 회원가입 테스트 시작');
    
    // 백그라운드에 있는 Overdare 앱 강제 종료
    console.log('🔄 백그라운드 Overdare 앱 강제 종료 중...');
    try {
      await driver.terminateApp('com.overdare.overdare.dev');
      console.log('✅ 백그라운드 Overdare 앱 강제 종료 완료');
      await driver.pause(2000);
    } catch (error) {
      console.log('⚠️ 앱 종료 중 오류:', error.message);
    }
    
    // 앱 데이터 초기화
    await driver.execute('mobile: clearApp', { appId: 'com.overdare.overdare.dev' });
    console.log('✅ 앱 데이터 초기화 완료');
    
    // 앱 재시작
    await driver.activateApp('com.overdare.overdare.dev');
    await driver.pause(3000);
    console.log('✅ 앱 재시작 완료');
    
    // QA 서버 선택
    const qaElement = await driver.$('//android.widget.TextView[@text="qa"]');
    if (qaElement) {
      await qaElement.click();
      console.log('✅ QA 서버 선택 완료');
    }

    // GO 버튼 클릭
    const goElement = await driver.$('//android.widget.TextView[@text="GO"]');
    if (goElement) {
      await goElement.click();
      console.log('✅ GO 버튼 클릭 완료');
    }

    // 홈 화면 도달 확인
    await driver.pause(2000);
    
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

    // 스크린샷 저장
    await takeOverdareScreenshot(driver, 'reset-signup-complete');
    
    console.log('✅ 앱 초기화 후 회원가입 테스트 완료');
  });

});
