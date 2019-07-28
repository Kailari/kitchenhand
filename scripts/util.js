const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const stringLength = require('string-length')

const PACKAGES_PATH = path.resolve(__dirname, '../packages')
const OK = chalk.reset.inverse.bold.green(' DONE ')

module.exports.OK = OK

module.exports.getPackages = function getPackages() {
  return fs
    .readdirSync(PACKAGES_PATH)
    .map(file => path.resolve(PACKAGES_PATH, file))
    .filter(f => fs.lstatSync(path.resolve(f)).isDirectory())
}

module.exports.adjustToTerminalWidth = function adjustToTerminalWidth(str) {
  const columns = process.stdout.columns || 80
  const WIDTH = columns - stringLength(OK) + 1
  const strs = str.match(new RegExp(`(.{1,${WIDTH}})`, 'g'))
  let lastString = strs[strs.length - 1]
  if (lastString.length < WIDTH) {
    lastString += Array(WIDTH - lastString.length).join(chalk.dim('.'))
  }
  return strs
    .slice(0, -1)
    .concat(lastString)
    .join('\n')
}
