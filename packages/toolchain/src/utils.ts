import chalk from 'chalk'

// eslint-disable-next-line unicorn/prefer-module
const fsutils = require('../rust-modules/fs-utils')

export default {
  headingFormat: chalk`{bold {red #} $1}`,

  fixedWidth(number: number, width: number) {
    return (Array.from({length: width}).join('0') + number).slice(-width)
  },

  prefixTime(message = '') {
    const date = new Date()

    const time = `${this.fixedWidth(date.getHours(), 2)}:${this.fixedWidth(date.getMinutes(), 2)}:${this.fixedWidth(date.getSeconds(), 2)}:${this.fixedWidth(date.getMilliseconds(), 4)}`
    return chalk`[{gray ${time}}] ${message}`
  },

  log(message = '') {
    const cursorTo = (process.stdout as any).cursorTo
    if (cursorTo) {
      cursorTo(0)
    }

    process.stdout.write(this.prefixTime(message) + '\n')
  },

  error(message = '') {
    this.log(chalk`{red ${message}}`)
  },

  time(label: string, template = '$1') {
    const startTime = process.hrtime.bigint()

    return {
      end: () => {
        const hrend = process.hrtime.bigint() - startTime
        // eslint-disable-next-line new-cap
        this.log(`${template.replace('$1', label)}: ${chalk.green((hrend / BigInt(1_000_000)) + 'ms')}`)
      },
    }
  },

  deleteFolderRecursive(folderPath: string) {
    folderPath = folderPath.trim()
    if (folderPath.length === 0 || folderPath === '/') return

    fsutils.deleteFolderRecursive(folderPath)
  },

  copyFolderRecursive(source: string, target: string) {
    source = source.trim()
    if (source.length === 0 || source === '/') return

    target = target.trim()
    if (target.length === 0 || target === '/') return

    fsutils.copyFolderRecursive(source, target)
  },
}
