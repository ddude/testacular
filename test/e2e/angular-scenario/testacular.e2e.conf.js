basePath = '../../../';

files = [
  ANGULAR_SCENARIO,
  'test/e2e/angular-scenario/testacular-ng-scenario-adapter.js',
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/angular-scenario/e2eSpec.js'
];

autoWatch = true;

proxies = {
  '/base': 'http://localhost:8000'
};
