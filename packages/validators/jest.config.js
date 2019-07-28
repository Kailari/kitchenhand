module.exports = {
  setupFilesAfterEnv: ['jest-extended'],
  rootDir: './src',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
}
