const { generateReportFolderName } = require('../utils/report-helper');
const { execSync } = require('child_process');

// 모든 테스트를 실행하는 폴더명 생성
function getAllTestsFolderName() {
  const timestamp = generateReportFolderName();
  return `all-tests-${timestamp}`;
}

// 명령어 처리
const command = process.argv[2];
if (!command) {
  console.log('사용법:');
  console.log('  node scripts/run-all-tests.js headed    - 모든 테스트 (브라우저 표시)');
  console.log('  node scripts/run-all-tests.js debug    - 모든 테스트 (디버그 모드)');
  console.log('  node scripts/run-all-tests.js pause     - 모든 테스트 (타임아웃 없음)');
  process.exit(1);
}

// 폴더명 설정
const folderName = getAllTestsFolderName();
process.env.REPORT_FOLDER_NAME = folderName;

console.log(`🚀 모든 테스트 시작...`);
console.log(`📁 리포트 폴더: ${folderName}`);

// Playwright 명령어 실행
let playwrightCommand;
switch (command) {
  case 'headed':
    playwrightCommand = 'npx playwright test tests/hub/avatar\(2d\)/eterno-create-avatar.spec.js --headed';
    break;
  case 'debug':
    playwrightCommand = 'npx playwright test tests/hub/avatar\(2d\)/eterno-create-avatar.spec.js --debug';
    break;
  case 'pause':
    playwrightCommand = 'npx playwright test tests/hub/avatar\(2d\)/eterno-create-avatar.spec.js --headed --timeout=0';
    break;
  default:
    console.log('❌ 잘못된 명령어입니다.');
    process.exit(1);
}

try {
  execSync(playwrightCommand, { stdio: 'inherit' });
  console.log(`✅ 모든 테스트 완료!`);
  console.log(`📊 리포트 확인: npx playwright show-report reports/${folderName}`);
} catch (error) {
  console.log(`❌ 일부 테스트가 실패했습니다.`);
  console.log(`📊 실패 리포트 확인: npx playwright show-report reports/${folderName}`);
  process.exit(1);
}
