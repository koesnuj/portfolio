const { generateReportFolderName } = require('../utils/report-helper');
const { execSync } = require('child_process');

// 플랫폼별 테스트 실행
const platform = process.argv[2];
const mode = process.argv[3] || 'headed';

if (!platform) {
  console.log('사용법:');
  console.log('  node scripts/run-platform-test.js hub [headed|debug|pause]    - Hub 테스트');
  console.log('  node scripts/run-platform-test.js studio [headed|debug|pause] - Studio 테스트');
  console.log('  node scripts/run-platform-test.js app [headed|debug|pause]    - App 테스트');
  process.exit(1);
}

if (!['hub', 'studio', 'app'].includes(platform)) {
  console.log('❌ 지원하는 플랫폼: hub, studio, app');
  process.exit(1);
}

// 폴더명 설정
const timestamp = generateReportFolderName();
const folderName = `${platform}-tests-${timestamp}`;
process.env.REPORT_FOLDER_NAME = folderName;

console.log(`🚀 ${platform.toUpperCase()} 테스트 시작...`);
console.log(`📁 리포트 폴더: ${folderName}`);

// Playwright 명령어 실행
let playwrightCommand;
const testPath = `tests/${platform}/`;

switch (mode) {
  case 'headed':
    playwrightCommand = `npx playwright test ${testPath} --headed`;
    break;
  case 'debug':
    playwrightCommand = `npx playwright test ${testPath} --debug`;
    break;
  case 'pause':
    playwrightCommand = `npx playwright test ${testPath} --headed --timeout=0`;
    break;
  default:
    console.log('❌ 지원하는 모드: headed, debug, pause');
    process.exit(1);
}

try {
  execSync(playwrightCommand, { stdio: 'inherit' });
  console.log(`✅ ${platform.toUpperCase()} 테스트 완료!`);
  console.log(`📊 리포트 확인: npx playwright show-report reports/${folderName}`);
} catch (error) {
  console.log(`❌ ${platform.toUpperCase()} 테스트 실패!`);
  console.log(`📊 실패 리포트 확인: npx playwright show-report reports/${folderName}`);
  process.exit(1);
}

