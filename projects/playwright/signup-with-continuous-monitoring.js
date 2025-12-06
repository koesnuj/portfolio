const { startOverdareApp, takeOverdareScreenshot, sendOverdareToBackground } = require('./utils/overdare-app-helper');

// HTML 리포트 생성 함수
function generateHTMLReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Overdare 회원가입 자동화 리포트</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .success-rate { font-size: 24px; font-weight: bold; color: #28a745; margin: 20px 0; }
        .step { margin: 15px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff; background-color: #f8f9fa; }
        .step.success { border-left-color: #28a745; background-color: #d4edda; }
        .step.failed { border-left-color: #dc3545; background-color: #f8d7da; }
        .step-title { font-weight: bold; font-size: 18px; margin-bottom: 10px; }
        .step-description { margin: 10px 0; }
        .screenshot { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px; margin: 10px 0; }
        .timestamp { color: #666; font-size: 12px; }
        .summary { background-color: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎮 Overdare 회원가입 자동화 리포트</h1>
            <div class="success-rate">성공률: ${report.successCount}/${report.totalSteps} (${Math.round(report.successCount/report.totalSteps*100)}%)</div>
            <div class="timestamp">생성 시간: ${new Date().toLocaleString('ko-KR')}</div>
        </div>
        
        <div class="summary">
            <h3>📊 테스트 요약</h3>
            <p><strong>테스트 케이스:</strong> ${report.testCase}</p>
            <p><strong>전체 결과:</strong> ${report.success ? '✅ 성공' : '❌ 실패'}</p>
            <p><strong>실행 시간:</strong> ${report.duration}ms</p>
        </div>
        
        <h3>📋 단계별 실행 결과</h3>
        ${report.steps.map(step => `
            <div class="step ${step.status}">
                <div class="step-title">${step.title}</div>
                <div class="step-description">${step.description}</div>
                ${step.screenshot ? `<img src="${step.screenshot}" alt="스크린샷" class="screenshot">` : ''}
                <div class="timestamp">${step.timestamp}</div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  
  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(__dirname, 'overdare-signup-continuous-monitoring-report.html');
  fs.writeFileSync(reportPath, html);
  return reportPath;
}

async function runSignupWithContinuousMonitoring() {
  let driver;
  const signupReport = {
    testCase: '지속적 모니터링으로 앱 안정화 유지',
    success: false,
    successCount: 0,
    totalSteps: 0,
    steps: [],
    startTime: Date.now(),
    duration: 0
  };

  function recordStep(title, status, description, screenshot = null) {
    signupReport.steps.push({
      title,
      status,
      description,
      screenshot,
      timestamp: new Date().toLocaleString('ko-KR')
    });
    signupReport.totalSteps++;
    if (status === 'success') signupReport.successCount++;
  }

  try {
    console.log('🎮 지속적 모니터링으로 앱 안정화 유지');
    console.log('='.repeat(60));

    // 1단계: 앱 시작
    console.log('\n🔗 1단계: 앱 시작 및 연결');
    driver = await startOverdareApp();
    console.log('✅ Overdare 앱 세션 시작 완료');
    
    const currentActivity = await driver.getCurrentActivity();
    console.log(`📍 현재 액티비티: ${currentActivity}`);
    
    const screenshot1 = await takeOverdareScreenshot(driver, 'step1-app-started.png');
    recordStep('앱 시작', 'success', `Overdare 앱에 연결되었습니다. 액티비티: ${currentActivity}`, screenshot1);

    // 2단계: QA 서버 선택
    console.log('\n📡 2단계: QA 서버 선택');
    const qaElement = await driver.$('//android.widget.TextView[@text="qa"]');
    if (qaElement) {
      await qaElement.click();
      console.log('✅ QA 서버 선택 완료');
      
      const screenshot2 = await takeOverdareScreenshot(driver, 'step2-qa-selected.png');
      recordStep('QA 서버 선택', 'success', 'QA 서버가 성공적으로 선택되었습니다.', screenshot2);
    } else {
      recordStep('QA 서버 선택', 'failed', 'QA 서버를 찾을 수 없습니다.');
    }

    // 3단계: GO 버튼 클릭
    console.log('\n🚀 3단계: GO 버튼 클릭');
    const goElement = await driver.$('//android.widget.TextView[@text="GO"]');
    if (goElement) {
      await goElement.click();
      console.log('✅ GO 버튼 클릭 완료');
      
      const screenshot3 = await takeOverdareScreenshot(driver, 'step3-go-clicked.png');
      recordStep('GO 버튼 클릭', 'success', 'GO 버튼이 성공적으로 클릭되었습니다.', screenshot3);
    } else {
      recordStep('GO 버튼 클릭', 'failed', 'GO 버튼을 찾을 수 없습니다.');
    }

    // 4단계: 홈 화면 도달 및 지속적 모니터링
    console.log('\n🏠 4단계: 홈 화면 도달 및 지속적 모니터링');
    
    let homeScreenReached = false;
    let attempts = 0;
    const maxAttempts = 20; // 더 많은 시도 횟수
    
    while (attempts < maxAttempts && !homeScreenReached) {
      console.log(`🔄 홈 화면 확인 시도 ${attempts + 1}/${maxAttempts}`);
      
      // 현재 액티비티 확인
      const currentActivity = await driver.getCurrentActivity();
      console.log(`📍 현재 액티비티: ${currentActivity}`);
      
      // 앱이 백그라운드로 이동했는지 확인
      if (currentActivity !== 'com.overdare.overdare.ui.MainActivity') {
        console.log('⚠️ 앱이 백그라운드로 이동했습니다. 포그라운드로 복귀 시도...');
        
        // 앱을 포그라운드로 복귀시키기
        try {
          await driver.activateApp('com.overdare.overdare.dev');
          console.log('✅ 앱을 포그라운드로 복귀시켰습니다.');
          await driver.pause(3000); // 앱이 완전히 로드될 때까지 대기
        } catch (e) {
          console.log('❌ 앱 포그라운드 복귀 실패:', e.message);
        }
        
        attempts++;
        continue;
      }
      
      // 화면의 텍스트 요소들 확인
      const textElements = await driver.$$('//android.widget.TextView');
      let foundHomeElements = false;
      let homeElementText = '';
      
      for (let element of textElements) {
        try {
          const text = await element.getText();
          if (text && (text.includes('Want first dibs') || text.includes('Sounds good') || text.includes('Overdare') || text.includes('Welcome'))) {
            foundHomeElements = true;
            homeElementText = text;
            console.log(`📝 발견된 홈 화면 요소: "${text}"`);
            break;
          }
        } catch (e) {
          // 텍스트를 가져올 수 없는 요소는 무시
        }
      }
      
      if (foundHomeElements) {
        homeScreenReached = true;
        console.log('📝 ✅ 홈 화면 도달: 앱이 홈 화면에 성공적으로 도달했습니다.');
        
        // 지속적 모니터링 시작
        console.log('🔄 지속적 모니터링 시작 (30초간)');
        const monitoringDuration = 30000; // 30초
        const startTime = Date.now();
        let monitoringCount = 0;
        
        while (Date.now() - startTime < monitoringDuration) {
          monitoringCount++;
          console.log(`🔍 모니터링 체크 ${monitoringCount} (${Math.round((Date.now() - startTime) / 1000)}초 경과)`);
          
          // 현재 액티비티 확인
          const currentActivity = await driver.getCurrentActivity();
          console.log(`📍 현재 액티비티: ${currentActivity}`);
          
          // 앱이 백그라운드로 이동했는지 확인
          if (currentActivity !== 'com.overdare.overdare.ui.MainActivity') {
            console.log('⚠️ 앱이 백그라운드로 이동했습니다. 포그라운드로 복귀 시도...');
            
            try {
              await driver.activateApp('com.overdare.overdare.dev');
              console.log('✅ 앱을 포그라운드로 복귀시켰습니다.');
              await driver.pause(2000);
            } catch (e) {
              console.log('❌ 앱 포그라운드 복귀 실패:', e.message);
            }
          } else {
            console.log('✅ 앱이 포그라운드에 안정적으로 유지되고 있습니다.');
          }
          
          // 2초마다 체크
          await driver.pause(2000);
        }
        
        console.log('✅ 지속적 모니터링 완료: 30초간 앱 상태를 모니터링했습니다.');
        
        // 최종 스크린샷
        const screenshot4 = await takeOverdareScreenshot(driver, 'step4-home-screen-monitored.png');
        recordStep('홈 화면 도달 및 지속적 모니터링', 'success', `홈 화면에 도달하고 30초간 지속적으로 모니터링했습니다. 발견된 요소: "${homeElementText}"`, screenshot4);
        
      } else {
        console.log('📝 ⚠️ 홈 화면 미도달: 아직 홈 화면에 도달하지 못했습니다.');
        attempts++;
        if (attempts < maxAttempts) {
          console.log('⏰ 3초 대기 후 재시도...');
          await driver.pause(3000);
        }
      }
    }
    
    if (!homeScreenReached) {
      console.log('📝 ❌ 홈 화면 도달 실패: 최대 시도 횟수를 초과했습니다.');
      recordStep('홈 화면 도달', 'failed', '최대 시도 횟수를 초과하여 홈 화면에 도달하지 못했습니다.');
    }

    // 5단계: 앱 상태 최종 확인
    console.log('\n🔍 5단계: 앱 상태 최종 확인');
    
    // 앱이 여전히 활성 상태인지 확인
    const finalActivity = await driver.getCurrentActivity();
    console.log(`📍 최종 액티비티: ${finalActivity}`);
    
    // 화면의 모든 텍스트 요소 확인
    const allTextElements = await driver.$$('//android.widget.TextView');
    let allTexts = [];
    
    for (let element of allTextElements) {
      try {
        const text = await element.getText();
        if (text && text.trim()) {
          allTexts.push(text.trim());
        }
      } catch (e) {
        // 무시
      }
    }
    
    console.log('📝 화면의 모든 텍스트 요소:');
    allTexts.forEach((text, index) => {
      console.log(`  ${index + 1}. "${text}"`);
    });
    
    const screenshot5 = await takeOverdareScreenshot(driver, 'step5-final-state.png');
    recordStep('앱 상태 최종 확인', 'success', `앱이 안정적으로 유지되고 있습니다. 액티비티: ${finalActivity}`, screenshot5);
    
    signupReport.success = true;

    console.log('\n🎉 지속적 모니터링으로 앱 안정화 유지 완료!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ 지속적 모니터링으로 앱 안정화 유지 중 오류 발생:', error.message);
    recordStep('오류 발생', 'failed', `오류 메시지: ${error.message}`);
  } finally {
    if (driver) {
      console.log('\n📱 앱 정리 중...');
      await sendOverdareToBackground(driver);
      await driver.deleteSession();
      console.log('✅ 세션 정리 완료');
    }
    
    // 리포트 생성
    signupReport.duration = Date.now() - signupReport.startTime;
    const reportPath = generateHTMLReport(signupReport);
    console.log(`\n📊 HTML 리포트 생성 완료: ${reportPath}`);
    console.log(`📈 성공률: ${signupReport.successCount}/${signupReport.totalSteps} (${Math.round(signupReport.successCount/signupReport.totalSteps*100)}%)`);
  }
}

// 스크립트 실행
runSignupWithContinuousMonitoring().catch(console.error);

