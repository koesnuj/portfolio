const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('수동 테스트 실행 및 백업 시작...');

// 전체 테스트 실행 및 백업 (HTML 열지 않음)
exec('npm run test', (error, stdout, stderr) => {
  if (error) {
    console.error('테스트 실행 오류:', error);
    return;
  }
  
  console.log('✅ 테스트 실행 완료');
  console.log(stdout);
  
  // 테스트 완료 후 백업 실행
  console.log('📦 리포트 백업 시작...');
  
  // 백업 폴더 생성
  const backupDir = 'playwright-report-backups';
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // 현재 시간으로 백업 폴더명 생성
  const now = new Date();
  const dateStamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const timeStamp = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

  // 같은 날짜로 시작하는 백업 폴더들 찾기
  const existingBackups = fs.readdirSync(backupDir)
    .filter(item => fs.statSync(path.join(backupDir, item)).isDirectory())
    .filter(item => item.startsWith(`backup_${dateStamp}_`))
    .map(item => {
      const match = item.match(/backup_(\d{4}-\d{2}-\d{2})_(\d+)/);
      return match ? parseInt(match[2]) : 0;
    })
    .sort((a, b) => a - b);

  const nextBackupNumber = existingBackups.length > 0 ? Math.max(...existingBackups) + 1 : 1;
  const backupFolderName = `backup_${dateStamp}_${nextBackupNumber}`;
  const backupPath = path.join(backupDir, backupFolderName);

  console.log(`📁 백업 폴더 생성: ${backupPath}`);

  // 리포트 폴더가 존재하는지 확인
  const reportDir = 'playwright-report';
  if (!fs.existsSync(reportDir)) {
    console.log('⚠️ 리포트 폴더가 존재하지 않습니다. 백업을 건너뜁니다.');
    return;
  }

  // 소스 폴더가 비어있는지 확인
  const sourceContents = fs.readdirSync(reportDir);
  if (sourceContents.length === 0) {
    console.log(`⚠️ 소스 폴더가 비어있어 백업을 건너뜁니다: ${reportDir}`);
    return;
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
    console.log(`📄 백업된 파일들: ${files.join(', ')}`);
    
    console.log('🎉 테스트 실행 및 백업 완료!');
    
  } catch (error) {
    console.error('❌ 백업 중 오류 발생:', error);
  }
});
