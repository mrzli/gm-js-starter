module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.test.json',
    },
  },
  testEnvironment: 'node',
  testRegex: ['/(?:test/automatic-tests)/.+\\.test\\.ts$'],
};
