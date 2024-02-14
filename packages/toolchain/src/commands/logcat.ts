import { credentials } from '@grpc/grpc-js'
import { Args, Command, Flags } from '@oclif/core'

import { LogLevel, LogLine } from '../devtools/.generated/typescript/PDTLogger'
import { PaperbackLoggerClient } from '../devtools/.generated/typescript/PDTLogger.grpc-client'

import chalk from 'chalk'

export default class Logcat extends Command {
    static args = {
        file: Args.string({ description: 'file to read' })
    }

    static description = 'describe the command here'

    static examples = ['<%= config.bin %> <%= command.id %>']

    static override flags = {
        ip: Flags.string({ default: 'localhost', name: 'ip' }),
        port: Flags.integer({ default: 27_015, name: 'port' })
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(Logcat)

        await new Promise((resolve, reject) => {
            const test = new PaperbackLoggerClient(
                `${flags.ip}:${flags.port}`,
                credentials.createInsecure()
            )
            test.streamLogs({})
                .on('data', (response: unknown) => {
                    const logLine = response as LogLine

                    let level

                    switch (logLine.level) {
                        case LogLevel.INFO: {
                            level = chalk.bold.bgGreenBright`[DEBUG]`
                            break
                        }

                        case LogLevel.ERROR: {
                            level = chalk.bold.bgRed`[ERROR]`
                            break
                        }

                        case LogLevel.WARN: {
                            level = chalk.bold.bgYellow`[WARN]`
                            break
                        }

                        default: {
                            level = chalk.bold.whiteBright`[UNKWN]`
                            break
                        }
                    }

                    console.log(
                        `${level} [${logLine.date?.seconds}] ${logLine.tags.map((x) => `[${x}]`).join(' ')} ${logLine.message}`
                    )
                })
                .on('error', reject)
                .on('close', resolve)
        })
    }
}
