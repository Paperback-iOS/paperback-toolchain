import {credentials} from '@grpc/grpc-js'
import {Flags} from '@oclif/core'
import {PaperbackLoggerClient} from '../devtools/generated/typescript/PDTLogger.grpc-client'
import {LogLevel, LogLine} from '../devtools/generated/typescript/PDTLogger'
import chalk from 'chalk'
import {CLICommand} from '../command'

export default class Logcat extends CLICommand {
  static override description = 'describe the command here'

  static override flags = {
    ip: Flags.string({name: 'ip', default: 'localhost'}),
    port: Flags.integer({name: 'port', default: 27_015}),
  }

  async run() {
    const {flags} = await this.parse(Logcat)

    await new Promise((resolve, reject) => {
      const test = new PaperbackLoggerClient(`${flags.ip}:${flags.port}`, credentials.createInsecure())
      test.streamLogs({}).on('data', (response: unknown) => {
        const logLine = response as LogLine

        let level

        switch (logLine.level) {
        case LogLevel.INFO:
          level = chalk.bold.bgGreenBright`[DEBUG]`
          break
        case LogLevel.ERROR:
          level = chalk.bold.bgRed`[ERROR]`
          break
        case LogLevel.WARN:
          level = chalk.bold.bgYellow`[WARN]`
          break
        default:
          level = chalk.bold.whiteBright`[UNKWN]`
          break
        }

        console.log(`${level} [${logLine.date?.seconds}] ${logLine.tags.map(x => `[${x}]`).join(' ')} ${logLine.message}`)
      })
      .on('error', reject)
      .on('close', resolve)
    })
  }
}
