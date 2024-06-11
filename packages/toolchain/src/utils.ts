/* eslint-disable unicorn/prefer-module */
import chalk from 'chalk'
import {promises as fs} from 'node:fs'

export default class Utils {
  static headingFormat = chalk`{bold {red #} $1}`

  fsutils: any
  constructor(useFSUtils = true) {
    let canUseFSUtils = false

    if (useFSUtils) {
      try {
        this.fsutils = require('@ivanmatthew/fs-utils-rs')
        canUseFSUtils = true
      } catch {
        canUseFSUtils = false
      }
    }

    if (!canUseFSUtils && useFSUtils) {
      const platform = require('node:os').platform()
      Utils.log(chalk`{yellow WARNING:} {gray (rust) fs-utils} is not available for your platform '${platform}', falling back to {gray node fs}!`)
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
        this.log(`${template.replace('$1', label)}: ${chalk.green((hrend / BigInt(1_000_000)) + 'ms')}`)
      },
    }
  }

  async deleteFolderRecursive(folderPath: string) {
    folderPath = folderPath.trim()
    if (folderPath.length === 0 || folderPath === '/') return

    if (this.fsutils) {
      return new Promise<void>((res, rej) => {
        try {
          this.fsutils.deleteFolderRecursive(folderPath)
          res()
        } catch (error) {
          rej(error)
        }
      })
    }

    await fs.rm(folderPath, {recursive: true}).catch(error => {
      console.error(`Error deleting and/or creating bundles directory '${folderPath}}'`, error)
    })
  }
}
