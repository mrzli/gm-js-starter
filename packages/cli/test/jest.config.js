module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/test/tsconfig.json'
    }
  },
  testEnvironment: 'node',
  testRegex: ['/(?:test)/.+\\.test\\.ts$']
};
