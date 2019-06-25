module.exports = {
  testEnvironment: '<rootDir>/test/environment/mongodb',
  setupFilesAfterEnv: ['jest-extended'],
  rootDir: './src',
  coveragePathIgnorePatterns: [
    '<rootDir>/static/'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/static/'
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
}