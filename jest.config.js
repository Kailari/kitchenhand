module.exports = {
  testEnvironment: '<rootDir>src/test/environment/mongodb',
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