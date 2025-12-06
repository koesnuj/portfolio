module.exports = {
  // Dev Bypass 로그인 계정 (Eterno Studio 로그인용) - 하드코딩
  devBypass: {
    username: 'test555',
    password: 'test555'
  },
  
  // 구글 OAuth2 테스트 계정 (백업용) - 하드코딩
  google: {
    email: 'odqa01@bluehole.net',
    password: 'odzbdpdl@@'
  },
  
  // 환경별 테스트 URL 설정
  environment: process.env.ETERNAL_ENV || 'qa', // 기본값: qa
  
  // 환경별 URL 매핑
  environments: {
    dev: {
      baseUrl: 'https://eterno-dev.ovdr.io',
      name: 'Development'
    },
    qa: {
      baseUrl: 'https://eterno-qa.ovdr.io',
      name: 'QA'
    },
    'release-qa': {
      baseUrl: 'https://eterno-release-qa.overdare.com',
      name: 'Release QA'
    },
    staging: {
      baseUrl: 'https://eterno-staging.ovdr.io',
      name: 'Staging'
    },
    prod: {
      baseUrl: 'https://eterno.ovdr.io',
      name: 'Production'
    }
  },
  
  // 현재 환경의 URL들
  urls: {
    homepage: function() {
      const config = require('./test-config');
      const env = config.environments[config.environment];
      return env ? env.baseUrl : 'https://eterno-qa.ovdr.io';
    },
    login: function() {
      const config = require('./test-config');
      return `${config.urls.homepage()}/login?redirectPage=/`;
    },
    signup: function() {
      const config = require('./test-config');
      return `${config.urls.homepage()}/signup`;
    },
    googleOAuth: 'https://accounts.google.com'
  },
  
  // OAuth2 설정
  oauth: {
    clientId: '810136049325-cp8f2q9qllvicr7l365ti905sk2gac9q.apps.googleusercontent.com', // Eterno Studio의 Google OAuth 클라이언트 ID
    redirectUri: function() {
      const config = require('./test-config');
      return `${config.urls.homepage()}/backend/auth/google/redirect`;
    },
    scope: 'email profile'
  },
  
  // 환경별 테스트 데이터 설정
  testData: {
    groups: {
      qa: {
        invalidGroup: 'asdf',
        validGroup: 'group'
      },
      'release-qa': {
        invalidGroup: 'asdf',
        validGroup: 'group-market'
      },
      dev: {
        invalidGroup: 'asdf',
        validGroup: 'group'
      },
      staging: {
        invalidGroup: 'asdf',
        validGroup: 'group'
      },
      prod: {
        invalidGroup: 'asdf',
        validGroup: 'group'
      }
    }
  },
};
