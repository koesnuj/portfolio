const { exec } = require('child_process');

console.log('스케줄러용 전체 테스트 실행 및 백업 시작...');
const env = process.env.ETERNAL_ENV || 'qa';
console.log(`🌍 환경 설정: ${env}`);

// 1. 전체 테스트 실행 (환경 변수 포함)
exec(`set ETERNAL_ENV=${env} && npx playwright test --reporter=html`, (error, stdout, stderr) => {
  if (error) {
    console.error('테스트 실행 오류:', error);
    return;
  }
  
  console.log('✅ 전체 테스트 완료');
  console.log(stdout);
  
  // 2. 테스트 완료 후 리포트 백업 (HTML 열지 않음)
  exec('node backup-report.js ALL', (error2, stdout2, stderr2) => {
    if (error2) {
      console.error('백업 오류:', error2);
      return;
    }
    
    console.log('✅ 리포트 백업 완료 (HTML 열지 않음)');
    console.log(stdout2);
    console.log('🎉 스케줄러 작업 완료!');
  });
});






