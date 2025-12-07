module.exports = {
  // TMS_v2 테스트 계정
  testAccount: {
    email: 'test@test.com',
    password: 'test1234',
    username: 'Test User'
  },
  
  // 환경별 테스트 URL 설정
  environment: process.env.TMS_ENV || 'production',
  
  // 환경별 URL 매핑
  environments: {
    local: {
      baseUrl: 'http://localhost:5173',
      name: 'Local Development'
    },
    production: {
      baseUrl: 'https://tms-v2-phi.vercel.app',
      name: 'Production'
    }
  },
  
  // 현재 환경의 URL들
  urls: {
    homepage: function() {
      const config = require('./test-config');
      const env = config.environments[config.environment];
      return env ? env.baseUrl : 'https://tms-v2-phi.vercel.app';
    },
    login: function() {
      const config = require('./test-config');
      return `${config.urls.homepage()}/login`;
    },
    register: function() {
      const config = require('./test-config');
      return `${config.urls.homepage()}/register`;
    },
    testcases: function() {
      const config = require('./test-config');
      return `${config.urls.homepage()}/testcases`;
    },
    plans: function() {
      const config = require('./test-config');
      return `${config.urls.homepage()}/plans`;
    },
    dashboard: function() {
      const config = require('./test-config');
      return `${config.urls.homepage()}/dashboard`;
    }
  },
  
  // 테스트 데이터
  testData: {
    folder: {
      name: 'Test Folder',
      description: 'Automated test folder'
    },
    testcase: {
      title: 'Sample Test Case',
      description: 'This is a test case created by automation',
      priority: 'HIGH',
      status: 'ACTIVE'
    },
    plan: {
      name: 'Test Plan',
      description: 'Automated test plan'
    }
  },
};
