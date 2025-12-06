// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { generateReportFolderName, backupReport } = require('./utils/report-helper');
const path = require('path');
const fs = require('fs');

// 환경 변수로 리포트 폴더명 관리
if (!process.env.REPORT_FOLDER_NAME) {
  process.env.REPORT_FOLDER_NAME = generateReportFolderName();
}

const reportFolder = path.join(process.cwd(), 'playwright-report');
const testResultsFolder = path.join(process.cwd(), 'test-results', process.env.REPORT_FOLDER_NAME);

// 폴더가 없으면 생성 (UI 모드가 아닐 때만)
if (!process.env.PLAYWRIGHT_UI_MODE) {
  // 기존 리포트가 있으면 백업
  if (fs.existsSync(reportFolder)) {
    backupReport(reportFolder);
  }
  
  if (!fs.existsSync(reportFolder)) {
    fs.mkdirSync(reportFolder, { recursive: true });
    console.log(`📁 리포트 폴더 생성: ${reportFolder}`);
  }

  if (!fs.existsSync(testResultsFolder)) {
    fs.mkdirSync(testResultsFolder, { recursive: true });
    console.log(`📁 테스트 결과 폴더 생성: ${testResultsFolder}`);
  }
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: reportFolder, open: 'on-failure' }],
    ['json', { outputFile: path.join(testResultsFolder, 'test-results.json') }],
    ['junit', { outputFile: path.join(testResultsFolder, 'test-results.xml') }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* 스크린샷 설정 */
    screenshot: 'on',  // 모든 테스트에서 스크린샷
    
    /* 비디오 녹화 설정 */
    video: 'on',       // 모든 테스트에서 영상 녹화
    
    /* 브라우저 유지 시간 설정 */
    launchOptions: {
      slowMo: 1000, // 각 액션 사이에 1초 대기
      args: [
        '--window-size=1920,1080',
        '--start-maximized'
      ]
    },
    
    /* 브라우저 설정 - 큰 화면으로 스크롤 방지 */
    viewport: { width: 1920, height: 1080 },
    hasTouch: false,
    isMobile: false,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* 다른 브라우저들은 주석 처리하여 Chrome만 실행 */
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

