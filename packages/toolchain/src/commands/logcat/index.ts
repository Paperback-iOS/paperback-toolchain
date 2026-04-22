import pc from 'picocolors'
import { credentials } from '@grpc/grpc-js'
import { PaperbackLoggerClient } from '../../.generated/toolchain/logcat/protobuf/PDTLogger.grpc-client.js'
import { LogLine, LogLevel } from '../../.generated/toolchain/logcat/protobuf/PDTLogger.js'
import type { LocalContext } from "../../context.js";

export interface LogcatFlags {
  ip: string
  port: number
}

export async function logcat(this: LocalContext, flags: LogcatFlags) {
  await new Promise((resolve, reject) => {
    const test = new PaperbackLoggerClient(
      `${flags.ip}:${flags.port}`,
      credentials.createInsecure()
    )
    test
      .streamLogs({})
      .on('data', (response: unknown) => {
        const logLine = response as LogLine

        let level

        switch (logLine.level) {
          case LogLevel.INFO: {
            level = pc.bold(pc.bgGreenBright('[DEBUG]'))
            break
          }

          case LogLevel.ERROR: {
            level = pc.bold(pc.bgRed('[ERROR]'))
            break
          }

          case LogLevel.WARN: {
            level = pc.bold(pc.bgYellow('[WARN]'))
            break
          }

          default: {
            level = pc.bold(pc.whiteBright('[WARN]'))
            break
          }
        }

        console.log(
          `${level} [${logLine.date?.seconds}] ${logLine.tags
            .map((x) => `[${x}]`)
            .join(' ')} ${logLine.message}`
        )
      })
      .on('error', reject)
      .on('close', resolve)
  })
}