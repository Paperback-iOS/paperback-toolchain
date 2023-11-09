/* eslint-disable unicorn/prefer-module */
import chalk from 'chalk'

export default class Utils {
  static headingFormat = chalk`{bold {red #} $1}`

  fs: any
  fsutils: any
  path: any = require('node:path')

  constructor(useFSUtils = true) {
    let canUseFSUtils = false
    const platform = require('node:os').platform()

    if (useFSUtils && platform === 'win32') {
      canUseFSUtils = true

      this.fsutils = require(this.path.join(__dirname, '..', 'rust-modules', 'fs-utils'))
    }

    if (!canUseFSUtils) {
      if (useFSUtils) {
        Utils.log(chalk`{yellow WARNING:} {gray (rust) fs-utils} is not available for your platform '${platform}', falling back to {gray node fs}!`)
      }

      this.fs = require('node:fs')
    }
  }

  static fixedWidth(number: number, width: number) {
    return (Array.from({length: width}).join('0') + number).slice(-width)
  }

  static prefixTime(message = '') {
    const date = new Date()

    const time = `${this.fixedWidth(date.getHours(), 2)}:${this.fixedWidth(date.getMinutes(), 2)}:${this.fixedWidth(date.getSeconds(), 2)}:${this.fixedWidth(date.getMilliseconds(), 4)}`
    return chalk`[{gray ${time}}] ${message}`
  }

  static log(message = '') {
    const cursorTo = (process.stdout as any).cursorTo
    if (cursorTo) {
      cursorTo(0)
    }

    process.stdout.write(this.prefixTime(message) + '\n')
  }

  static error(message = '') {
    this.log(chalk`{red ${message}}`)
  }

  static time(label: string, template = '$1') {
    const startTime = process.hrtime.bigint()

    return {
      end: () => {
        const hrend = process.hrtime.bigint() - startTime
        // eslint-disable-next-line new-cap
        this.log(`${template.replace('$1', label)}: ${chalk.green((hrend / BigInt(1_000_000)) + 'ms')}`)
      },
    }
  }

  deleteFolderRecursive(folderPath: string) {
    folderPath = folderPath.trim()
    if (folderPath.length === 0 || folderPath === '/') return

    if (this.fsutils) {
      this.fsutils.deleteFolderRecursive(folderPath)
    } else if (this.fs.existsSync(folderPath)) {
      for (const file of this.fs.readdirSync(folderPath)) {
        const curPath = this.path.join(folderPath, file)

        if (this.fs.lstatSync(curPath).isDirectory()) { // recurse
          this.deleteFolderRecursive(curPath)
        } else { // delete file
          this.fs.unlinkSync(curPath)
        }
      }

      this.fs.rmdirSync(folderPath)
    }
  }

  copyFolderRecursive(source: string, target: string) {
    source = source.trim()
    if (source.length === 0 || source === '/') return

    target = target.trim()
    if (target.length === 0 || target === '/') return

    if (this.fsutils) {
      this.fsutils.copyFolderRecursive(source, target)
    } else {
      if (!this.fs.existsSync(source)) return

      let files = []
      // check if folder needs to be created or integrated
      const targetFolder = this.path.join(target, this.path.basename(source))
      if (!this.fs.existsSync(targetFolder)) {
        this.fs.mkdirSync(targetFolder)
      }

      // copy
      if (this.fs.lstatSync(source).isDirectory()) {
        files = this.fs.readdirSync(source)
        for (const file of files) {
          const curSource = this.path.join(source, file)
          if (this.fs.lstatSync(curSource).isDirectory()) {
            this.copyFolderRecursive(curSource, targetFolder)
          } else {
            this.fs.copyFileSync(curSource, this.path.join(targetFolder, file))
          }
        }
      }
    }
  }
}
