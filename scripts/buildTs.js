const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const execa = require('execa')

const { getPackages, adjustToTerminalWidth, OK } = require('./util')

const IGNORED = [
  'front'
]

console.log('wd: ', __dirname)

const packages = getPackages()
const packagesWithTs = packages
  .filter(p => !IGNORED.includes(path.basename(p)))
  .filter(p => fs.existsSync(path.resolve(p, 'tsconfig.json')))

const args = [
  '--max-old-space-size=4096',
  path.resolve(
    require.resolve('typescript/package.json'),
    '..',
    require('typescript/package.json').bin.tsc
  ),
  '--build',
  ...packagesWithTs,
  ...process.argv.slice(2),
]

console.log(chalk.inverse('Building TypeScript definition files'))
process.stdout.write(adjustToTerminalWidth('Building\n'))

try {
  execa.sync('node', args, { stdio: 'inherit' })
  process.stdout.write(`${OK}\n`)
} catch (error) {
  process.stdout.write('\n')
  console.error(chalk.inverse.red('Unable to build TypeScript definition files'))
  console.error(error.stack)
  process.exitCode = 1
}
