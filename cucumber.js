// cucumber.js
const common = [
  'test/features/**/*.feature',
  '--require-module ts-node/register',
  '--require-module tsconfig-paths/register',
  '--require test/steps/**/*.ts',
  '--format progress-bar',
  '--format json:reports/cucumber_report.json',
  '--format html:reports/cucumber_report.html',
].join(' ');

module.exports = {
  default: common,
};
