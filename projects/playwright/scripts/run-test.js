const { generateReportFolderName } = require('../utils/report-helper');
const { execSync } = require('child_process');

// 테스트 타입에 따른 폴더명 생성
function getTestFolderName(testType) {
  const timestamp = generateReportFolderName();
  return `${testType}-${timestamp}`;
}

// 명령어 처리
const testType = process.argv[2];
if (!testType) {
  console.log('사용법:');
  console.log('  node scripts/run-test.js step1    - 1단계 테스트');
  console.log('  node scripts/run-test.js step2    - 2단계 테스트');
  console.log('  node scripts/run-test.js step3    - 3단계 테스트');
  console.log('  node scripts/run-test.js step4    - 4단계 테스트');
  console.log('  node scripts/run-test.js step5    - 5단계 테스트');
  console.log('  node scripts/run-test.js step6    - 6단계 테스트');
  process.exit(1);
}

// 폴더명 설정
const folderName = getTestFolderName(testType);
process.env.REPORT_FOLDER_NAME = folderName;

console.log(`🚀 ${testType} 테스트 시작...`);
console.log(`📁 리포트 폴더: ${folderName}`);

// Playwright 명령어 실행
const grepPattern = `${testType.replace('step', '')}단계`;
const command = `npx playwright test tests/hub/avatar\(2d\)/eterno-create-avatar.spec.js --grep "${grepPattern}" --headed`;

try {
  execSync(command, { stdio: 'inherit' });
  console.log(`✅ ${testType} 테스트 완료!`);
} catch (error) {
  console.log(`❌ ${testType} 테스트 실패!`);
  process.exit(1);
}
