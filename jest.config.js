module.exports = {
  testEnvironment: '<rootDir>src/test/environment/mongodb',
  setupFilesAfterEnv: ['jest-extended'],
  coveragePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/packages/'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/packages/'
  ]
}