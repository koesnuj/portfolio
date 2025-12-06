const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 명령행 인수에서 테스트 타입 가져오기 (예: @step1, @step2, ALL)
const testType = process.argv[2] || 'ALL';

// 백업 폴더 생성
const backupDir = 'playwright-report-backups';
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// 현재 시간으로 백업 폴더명 생성
const now = new Date();
const dateStamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

// 테스트 타입에 따라 폴더명 결정
let stepName;
if (testType === 'ALL') {
  stepName = 'Step_ALL';
} else if (testType.startsWith('@step')) {
  // @step1 -> Step1, @step2 -> Step2
  stepName = testType.replace('@', '').replace('step', 'Step');
} else if (testType === '@final-step') {
  stepName = 'Step_final-step';
} else {
  stepName = 'Step_UNKNOWN';
}

// 같은 날짜와 스텝으로 시작하는 백업 폴더들 찾기
const existingBackups = fs.readdirSync(backupDir)
  .filter(item => fs.statSync(path.join(backupDir, item)).isDirectory())
  .filter(item => item.startsWith(`backup_${dateStamp}_${stepName}_`))
  .map(item => {
    const match = item.match(/backup_(\d{4}-\d{2}-\d{2})_(\w+)_(\d+)/);
    return match ? parseInt(match[3]) : 0;
  })
  .sort((a, b) => a - b);

const nextBackupNumber = existingBackups.length > 0 ? Math.max(...existingBackups) + 1 : 1;
const backupFolderName = `backup_${dateStamp}_${stepName}_${nextBackupNumber}`;
const backupPath = path.join(backupDir, backupFolderName);

console.log(`백업 폴더 생성: ${backupPath}`);

// 리포트 폴더가 존재하는지 확인
const reportDir = 'playwright-report';
if (!fs.existsSync(reportDir)) {
  console.error('리포트 폴더가 존재하지 않습니다. 먼저 테스트를 실행해주세요.');
  process.exit(1);
}

// 백업 폴더 생성
fs.mkdirSync(backupPath, { recursive: true });

// 리포트 폴더 전체 복사
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

try {
  copyDir(reportDir, backupPath);
  console.log(`✅ 리포트 백업 완료: ${backupPath}`);
  
  // 백업된 파일 목록 출력
  const files = fs.readdirSync(backupPath);
  console.log(`백업된 파일들: ${files.join(', ')}`);
  
  // 백업 완료 후 원본 리포트 폴더 삭제 (다음 테스트를 위해)
  fs.rmSync(reportDir, { recursive: true, force: true });
  console.log('✅ 원본 리포트 폴더 삭제 완료 (다음 테스트를 위해)');
  
} catch (error) {
  console.error('백업 중 오류 발생:', error);
}
