const { getLatestReportFolder, listReportFolders } = require('../utils/report-helper');

// 최신 리포트 보기
function showLatestReport() {
  const latestFolder = getLatestReportFolder();
  if (latestFolder) {
    console.log(`📊 최신 리포트 폴더: ${latestFolder}`);
    console.log(`🚀 리포트 열기: npx playwright show-report "${latestFolder}"`);
    require('child_process').execSync(`npx playwright show-report "${latestFolder}"`, { stdio: 'inherit' });
  } else {
    console.log('❌ 리포트 폴더를 찾을 수 없습니다.');
  }
}

// 리포트 목록 보기
function listReports() {
  const folders = listReportFolders();
  if (folders.length > 0) {
    console.log('📋 리포트 폴더 목록:');
    folders.forEach((folder, index) => {
      console.log(`${index + 1}. ${folder}`);
    });
  } else {
    console.log('❌ 리포트 폴더가 없습니다.');
  }
}

// 명령어 처리
const command = process.argv[2];
switch (command) {
  case 'latest':
    showLatestReport();
    break;
  case 'list':
    listReports();
    break;
  default:
    console.log('사용법:');
    console.log('  node scripts/report.js latest  - 최신 리포트 보기');
    console.log('  node scripts/report.js list    - 리포트 목록 보기');
}
