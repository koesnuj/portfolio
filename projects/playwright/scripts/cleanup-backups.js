const fs = require('fs');
const path = require('path');

/**
 * 빈 백업 폴더들을 정리하는 스크립트
 */
function cleanupEmptyBackups() {
  const backupDir = path.join(process.cwd(), 'playwright-report-backups');
  
  if (!fs.existsSync(backupDir)) {
    console.log('📁 백업 폴더가 존재하지 않습니다.');
    return;
  }
  
  const backupFolders = fs.readdirSync(backupDir)
    .filter(item => fs.statSync(path.join(backupDir, item)).isDirectory());
  
  let cleanedCount = 0;
  
  backupFolders.forEach(folder => {
    const folderPath = path.join(backupDir, folder);
    const contents = fs.readdirSync(folderPath);
    
    if (contents.length === 0) {
      try {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`🗑️ 빈 백업 폴더 삭제: ${folder}`);
        cleanedCount++;
      } catch (error) {
        console.error(`❌ 폴더 삭제 실패: ${folder}`, error.message);
      }
    }
  });
  
  console.log(`✅ 정리 완료: ${cleanedCount}개의 빈 폴더가 삭제되었습니다.`);
}

// 스크립트 실행
cleanupEmptyBackups();
