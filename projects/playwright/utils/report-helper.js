const fs = require('fs');
const path = require('path');

/**
 * 현재 날짜/시간을 기반으로 리포트 폴더명 생성
 * @returns {string} 폴더명 (예: 2024-09-04_14-30-25)
 */
function generateReportFolderName() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * 리포트 폴더 생성 및 경로 반환
 * @param {string} baseDir - 기본 디렉토리 (기본값: 'reports')
 * @returns {string} 생성된 폴더의 전체 경로
 */
function createReportFolder(baseDir = 'reports') {
  const folderName = generateReportFolderName();
  const fullPath = path.join(process.cwd(), baseDir, folderName);
  
  // 폴더가 없으면 생성
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 리포트 폴더 생성: ${fullPath}`);
  }
  
  return fullPath;
}

/**
 * 테스트 결과 폴더 경로 생성
 * @param {string} baseDir - 기본 디렉토리 (기본값: 'test-results')
 * @returns {string} 생성된 폴더의 전체 경로
 */
function createTestResultsFolder(baseDir = 'test-results') {
  const folderName = generateReportFolderName();
  const fullPath = path.join(process.cwd(), baseDir, folderName);
  
  // 폴더가 없으면 생성
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 테스트 결과 폴더 생성: ${fullPath}`);
  }
  
  return fullPath;
}

/**
 * 최신 리포트 폴더 찾기
 * @param {string} baseDir - 기본 디렉토리 (기본값: 'reports')
 * @returns {string|null} 최신 폴더 경로 또는 null
 */
function getLatestReportFolder(baseDir = 'reports') {
  const reportsPath = path.join(process.cwd(), baseDir);
  
  if (!fs.existsSync(reportsPath)) {
    return null;
  }
  
  const folders = fs.readdirSync(reportsPath)
    .filter(item => fs.statSync(path.join(reportsPath, item)).isDirectory())
    .sort()
    .reverse();
  
  return folders.length > 0 ? path.join(reportsPath, folders[0]) : null;
}

/**
 * 모든 리포트 폴더 목록 반환
 * @param {string} baseDir - 기본 디렉토리 (기본값: 'reports')
 * @returns {Array} 폴더 목록
 */
function listReportFolders(baseDir = 'reports') {
  const reportsPath = path.join(process.cwd(), baseDir);
  
  if (!fs.existsSync(reportsPath)) {
    return [];
  }
  
  return fs.readdirSync(reportsPath)
    .filter(item => fs.statSync(path.join(reportsPath, item)).isDirectory())
    .sort()
    .reverse();
}

/**
 * 현재 날짜/시간 정보를 문자열로 반환
 * @returns {string} 날짜/시간 문자열 (예: 2024년 9월 4일 14시 30분 25초)
 */
function getCurrentDateTimeString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;
}

/**
 * 기존 리포트를 백업 폴더로 이동
 * @param {string} sourcePath - 소스 리포트 폴더 경로
 * @param {string} backupDir - 백업 디렉토리 (기본값: 'playwright-report-backups')
 */
function backupReport(sourcePath, backupDir = 'playwright-report-backups') {
  if (!fs.existsSync(sourcePath)) {
    return;
  }
  
  // 소스 폴더가 비어있는지 확인
  const sourceContents = fs.readdirSync(sourcePath);
  if (sourceContents.length === 0) {
    console.log(`⚠️ 소스 폴더가 비어있어 백업을 건너뜁니다: ${sourcePath}`);
    return;
  }
  
  const backupPath = path.join(process.cwd(), backupDir);
  
  // 백업 폴더 생성
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
    console.log(`📁 백업 폴더 생성: ${backupPath}`);
  }
  
  // 현재 날짜로 기본 타임스탬프 생성 (시간 제외)
  const now = new Date();
  const dateStamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  // 같은 날짜로 시작하는 백업 폴더들 찾기
  const existingBackups = fs.readdirSync(backupPath)
    .filter(item => fs.statSync(path.join(backupPath, item)).isDirectory())
    .filter(item => item.startsWith(`backup_${dateStamp}_`))
    .map(item => {
      const match = item.match(/backup_(\d{4}-\d{2}-\d{2})_(\d+)/);
      return match ? parseInt(match[2]) : 0;
    })
    .sort((a, b) => a - b);
  
  const nextBackupNumber = existingBackups.length > 0 ? Math.max(...existingBackups) + 1 : 1;
  const backupFolderName = `backup_${dateStamp}_${nextBackupNumber}`;
  const targetPath = path.join(backupPath, backupFolderName);
  
  // 이미 같은 이름의 백업 폴더가 있는지 확인
  if (fs.existsSync(targetPath)) {
    console.log(`⚠️ 백업 폴더가 이미 존재합니다: ${targetPath}`);
    return;
  }
  
  // 리포트 폴더를 백업 폴더로 복사
  try {
    // 백업 실행
    fs.cpSync(sourcePath, targetPath, { recursive: true });
    console.log(`📦 리포트 백업 완료: ${targetPath}`);
    
    // 원본 폴더 삭제 (더 안전한 방법)
    try {
      // 먼저 파일들을 개별적으로 삭제 시도
      const files = fs.readdirSync(sourcePath, { withFileTypes: true });
      for (const file of files) {
        const filePath = path.join(sourcePath, file.name);
        if (file.isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      }
      fs.rmdirSync(sourcePath);
      console.log(`🗑️ 기존 리포트 폴더 삭제: ${sourcePath}`);
    } catch (deleteError) {
      console.log(`⚠️ 폴더 삭제 중 일부 파일이 잠겨있음: ${deleteError.message}`);
      // 폴더 삭제가 실패해도 계속 진행
    }
  } catch (error) {
    console.error('백업 중 오류 발생:', error);
  }
}

module.exports = {
  generateReportFolderName,
  createReportFolder,
  createTestResultsFolder,
  getLatestReportFolder,
  listReportFolders,
  getCurrentDateTimeString,
  backupReport
};
