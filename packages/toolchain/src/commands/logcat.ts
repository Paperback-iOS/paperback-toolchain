import {credentials} from '@grpc/grpc-js'
import {Flags} from '@oclif/core'
import {PaperbackLoggerClient} from '../devtools/generated/typescript/PDTLogger_grpc_pb'
import {LogFilter, LogLine} from '../devtools/generated/typescript/PDTLogger_pb'
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
      test.streamLogs(new LogFilter()).on('data', (response: unknown) => {
        const logLine = response as LogLine

        let level

        switch (logLine.getLevel()) {
        case LogLine.LogLevel.INFO:
          level = chalk.bold.bgGreenBright`[DEBUG]`
          break
        case LogLine.LogLevel.ERROR:
          level = chalk.bold.bgRed`[ERROR]`
          break
        case LogLine.LogLevel.WARN:
          level = chalk.bold.bgYellow`[WARN]`
          break
        default:
          level = chalk.bold.whiteBright`[UNKWN]`
          break
        }

        // eslint-disable-next-line no-console
        console.log(`${level} [${logLine.getDate()?.toDate().getTime()}] ${logLine.getTagsList().map(x => `[${x}]`).join(' ')} ${logLine.getMessage()}`)
      })
      .on('error', reject)
      .on('close', resolve)
    })
  }
}
