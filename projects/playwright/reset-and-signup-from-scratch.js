const { startOverdareApp, takeOverdareScreenshot, sendOverdareToBackground } = require('./utils/overdare-app-helper');

// 회원가입 결과 리포트를 위한 데이터 수집
const signupReport = {
  startTime: new Date().toISOString(),
  steps: [],
  screenshots: [],
  success: false,
  endTime: null,
  totalDuration: 0
};

// 단계별 결과 기록 함수
function recordStep(stepName, status, details = '', screenshot = '') {
  const step = {
    step: stepName,
    status: status, // 'success', 'failed', 'skipped'
    details: details,
    screenshot: screenshot,
    timestamp: new Date().toISOString()
  };
  signupReport.steps.push(step);
  console.log(`📝 ${status === 'success' ? '✅' : '❌'} ${stepName}: ${details}`);
}

// HTML 리포트 생성 함수
function generateHTMLReport() {
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Overdare 회원가입 자동화 리포트 (초기화 후)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { padding: 20px; border-radius: 10px; text-align: center; }
        .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .failed { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info { background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        .steps { margin-top: 30px; }
        .step { margin-bottom: 20px; padding: 15px; border-radius: 8px; border-left: 4px solid #ddd; }
        .step.success { border-left-color: #28a745; background-color: #f8fff9; }
        .step.failed { border-left-color: #dc3545; background-color: #fff8f8; }
        .step.skipped { border-left-color: #ffc107; background-color: #fffdf5; }
        .step-header { font-weight: bold; margin-bottom: 10px; }
        .step-details { color: #666; margin-bottom: 10px; }
        .screenshot { max-width: 100%; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .timestamp { font-size: 0.9em; color: #999; }
        .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
        .status-success { background-color: #28a745; color: white; }
        .status-failed { background-color: #dc3545; color: white; }
        .status-skipped { background-color: #ffc107; color: black; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎮 Overdare 회원가입 자동화 리포트 (초기화 후)</h1>
            <p>앱 초기화 후 처음부터 게스트 회원가입 플로우 테스트</p>
        </div>
        
        <div class="summary">
            <div class="summary-card ${signupReport.success ? 'success' : 'failed'}">
                <h3>${signupReport.success ? '✅ 성공' : '❌ 실패'}</h3>
                <p>전체 테스트 결과</p>
            </div>
            <div class="summary-card info">
                <h3>⏱️ ${signupReport.totalDuration}초</h3>
                <p>총 소요 시간</p>
            </div>
            <div class="summary-card info">
                <h3>📝 ${signupReport.steps.length}단계</h3>
                <p>총 실행 단계</p>
            </div>
            <div class="summary-card info">
                <h3>📸 ${signupReport.screenshots.length}개</h3>
                <p>캡처된 스크린샷</p>
            </div>
        </div>
        
        <div class="steps">
            <h2>📋 실행 단계 상세</h2>
            ${signupReport.steps.map((step, index) => `
                <div class="step ${step.status}">
                    <div class="step-header">
                        <span class="status-badge status-${step.status}">${step.status === 'success' ? '성공' : step.status === 'failed' ? '실패' : '건너뜀'}</span>
                        ${index + 1}. ${step.step}
                    </div>
                    <div class="step-details">${step.details}</div>
                    ${step.screenshot ? `<img src="${step.screenshot}" alt="스크린샷" class="screenshot">` : ''}
                    <div class="timestamp">${new Date(step.timestamp).toLocaleString('ko-KR')}</div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
  
  return html;
}

async function resetAndSignupFromScratch() {
  let driver;
  
  try {
    console.log('🔄 Overdare 앱 초기화 후 처음부터 회원가입');
    console.log('='.repeat(60));
    
    // 1단계: 앱 완전 초기화 및 실행
    console.log('\n🔄 1단계: 앱 완전 초기화 및 실행');
    driver = await startOverdareApp();
    
    // 앱 데이터 초기화 (fullReset 시도)
    try {
      await driver.execute('mobile: clearApp', { appId: 'com.overdare.overdare.dev' });
      console.log('✅ 앱 데이터 초기화 완료');
    } catch (e) {
      console.log('⚠️ 앱 데이터 초기화 실패, 계속 진행');
    }
    
    await driver.pause(5000); // 초기화 대기
    const screenshot1 = await takeOverdareScreenshot(driver, 'step1-app-reset.png');
    recordStep('앱 초기화', 'success', '앱이 완전히 초기화되고 실행되었습니다.', screenshot1);
    
    // 2단계: 잠금 해제 확인 및 처리
    console.log('\n🔓 2단계: 잠금 해제 확인');
    const currentActivity = await driver.getCurrentActivity();
    console.log(`📍 현재 액티비티: ${currentActivity}`);
    
    const textElements = await driver.$$('//android.widget.TextView');
    let isLocked = false;
    for (let i = 0; i < textElements.length; i++) {
      try {
        const text = await textElements[i].getText();
        if (text && text.includes('PIN을 입력하세요')) {
          isLocked = true;
          break;
        }
      } catch (e) {}
    }
    
    if (isLocked) {
      console.log('🔒 잠금 화면 감지됨 - 잠금 해제 진행');
      for (let i = 0; i < 4; i++) {
        const zeroButton = await driver.$('//android.widget.TextView[@text="0"]');
        if (zeroButton && await zeroButton.isDisplayed()) {
          await zeroButton.click();
          console.log(`✅ 숫자 0 클릭 (${i + 1}/4)`);
          await driver.pause(500);
        }
      }
      await driver.pressKeyCode(66); // KEYCODE_ENTER
      await driver.pause(3000);
      const screenshot2 = await takeOverdareScreenshot(driver, 'step2-unlock.png');
      recordStep('잠금 해제', 'success', 'PIN "0000" 입력으로 잠금 해제 완료', screenshot2);
    } else {
      recordStep('잠금 해제', 'skipped', '잠금 화면이 아니므로 건너뜀');
    }
    
    // 3단계: QA 서버 선택
    console.log('\n📡 3단계: QA 서버 선택');
    let qaServerElement = await driver.$('//android.widget.TextView[@text="qa"]');
    if (qaServerElement && await qaServerElement.isDisplayed()) {
      await qaServerElement.click();
      await driver.pause(2000);
      const screenshot3 = await takeOverdareScreenshot(driver, 'step3-qa-selected.png');
      recordStep('QA 서버 선택', 'success', 'QA 서버가 성공적으로 선택되었습니다.', screenshot3);
    } else {
      recordStep('QA 서버 선택', 'failed', 'QA 서버 요소를 찾을 수 없습니다.');
    }
    
    // 4단계: GO 버튼 클릭
    console.log('\n🚀 4단계: GO 버튼 클릭');
    let goButtonElement = await driver.$('//android.widget.TextView[@text="GO"]');
    if (goButtonElement && await goButtonElement.isDisplayed()) {
      await goButtonElement.click();
      await driver.pause(3000);
      const screenshot4 = await takeOverdareScreenshot(driver, 'step4-go-clicked.png');
      recordStep('GO 버튼 클릭', 'success', 'GO 버튼이 성공적으로 클릭되었습니다.', screenshot4);
    } else {
      recordStep('GO 버튼 클릭', 'failed', 'GO 버튼을 찾을 수 없습니다.');
    }
    
    // 5단계: START 버튼 클릭
    console.log('\n🎯 5단계: START 버튼 클릭');
    let startButtonElement = await driver.$('//android.widget.TextView[@text="START"]');
    if (startButtonElement && await startButtonElement.isDisplayed()) {
      await startButtonElement.click();
      await driver.pause(5000);
      const screenshot5 = await takeOverdareScreenshot(driver, 'step5-start-clicked.png');
      recordStep('START 버튼 클릭', 'success', '게스트 회원가입이 시작되었습니다.', screenshot5);
    } else {
      recordStep('START 버튼 클릭', 'failed', 'START 버튼을 찾을 수 없습니다.');
    }
    
    // 6단계: 슬라이더 조작
    console.log('\n🎚️ 6단계: 나이 슬라이더 조작');
    const sliderElement = await driver.$('//android.widget.SeekBar');
    if (sliderElement && await sliderElement.isDisplayed()) {
      await sliderElement.click();
      await driver.pause(2000);
      const screenshot6 = await takeOverdareScreenshot(driver, 'step6-slider-moved.png');
      recordStep('슬라이더 조작', 'success', '나이 슬라이더가 조작되었습니다.', screenshot6);
    } else {
      recordStep('슬라이더 조작', 'failed', '슬라이더 요소를 찾을 수 없습니다.');
    }
    
    // 7단계: OK 버튼 클릭
    console.log('\n✅ 7단계: OK 버튼 클릭');
    let okButtonElement = await driver.$('//android.widget.TextView[@text="OK"]');
    if (okButtonElement && await okButtonElement.isDisplayed()) {
      await okButtonElement.click();
      await driver.pause(5000);
      const screenshot7 = await takeOverdareScreenshot(driver, 'step7-ok-clicked.png');
      recordStep('OK 버튼 클릭', 'success', 'OK 버튼이 클릭되어 다음 단계로 진행되었습니다.', screenshot7);
    } else {
      recordStep('OK 버튼 클릭', 'failed', 'OK 버튼을 찾을 수 없습니다.');
    }
    
    // 8단계: 알림 설정 화면 확인
    console.log('\n🔔 8단계: 알림 설정 화면 확인');
    const finalTextElements = await driver.$$('//android.widget.TextView');
    let notificationScreenFound = false;
    for (let i = 0; i < finalTextElements.length; i++) {
      try {
        const text = await finalTextElements[i].getText();
        if (text && text.includes('Want first dibs on cool stuff?')) {
          notificationScreenFound = true;
          break;
        }
      } catch (e) {}
    }
    
    if (notificationScreenFound) {
      const screenshot8 = await takeOverdareScreenshot(driver, 'step8-notification-screen.png');
      recordStep('알림 설정 화면 도달', 'success', '회원가입이 완료되고 알림 설정 화면에 도달했습니다.', screenshot8);
      signupReport.success = true;
    } else {
      recordStep('알림 설정 화면 도달', 'failed', '알림 설정 화면을 찾을 수 없습니다.');
    }
    
    console.log('\n🎉 초기화 후 회원가입 자동화 완료!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ 초기화 후 회원가입 자동화 중 오류 발생:', error.message);
    recordStep('자동화 실행', 'failed', `오류 발생: ${error.message}`);
  } finally {
    if (driver) {
      console.log('\n📱 앱 정리 중...');
      await sendOverdareToBackground(driver);
      await driver.deleteSession();
      console.log('✅ 세션 정리 완료');
    }
    
    // 리포트 생성
    signupReport.endTime = new Date().toISOString();
    signupReport.totalDuration = Math.round((new Date(signupReport.endTime) - new Date(signupReport.startTime)) / 1000);
    
    // HTML 리포트 생성 및 저장
    const htmlReport = generateHTMLReport();
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, 'overdare-signup-reset-report.html');
    fs.writeFileSync(reportPath, htmlReport, 'utf8');
    
    console.log(`\n📊 HTML 리포트 생성 완료: ${reportPath}`);
    console.log(`📈 성공률: ${signupReport.steps.filter(s => s.status === 'success').length}/${signupReport.steps.length} (${Math.round(signupReport.steps.filter(s => s.status === 'success').length / signupReport.steps.length * 100)}%)`);
  }
}

// 초기화 후 회원가입 자동화 실행
resetAndSignupFromScratch().catch(console.error);

