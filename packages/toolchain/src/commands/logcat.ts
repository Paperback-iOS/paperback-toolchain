import { credentials } from "@grpc/grpc-js";
import { Args, Command, Flags } from "@oclif/core";

import { LogLevel, LogLine } from "../devtools/.generated/typescript/PDTLogger.js";
import { PaperbackLoggerClient } from "../devtools/.generated/typescript/PDTLogger.grpc-client.js";

import pc from "picocolors"

export default class Logcat extends Command {
  static override args = {
    file: Args.string({ description: "file to read" }),
  };

  static override description = "describe the command here";

  static override examples = ["<%= config.bin %> <%= command.id %>"];

  static override flags = {
    ip: Flags.string({ default: "localhost", name: "ip" }),
    port: Flags.integer({ default: 27_015, name: "port" }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Logcat);

    await new Promise((resolve, reject) => {
      const test = new PaperbackLoggerClient(
        `${flags.ip}:${flags.port}`,
        credentials.createInsecure(),
      );
      test.streamLogs({})
        .on("data", (response: unknown) => {
          const logLine = response as LogLine;

          let level;

          switch (logLine.level) {
            case LogLevel.INFO: {
              level = pc.bold(pc.bgGreenBright('[DEBUG]'));
              break;
            }

            case LogLevel.ERROR: {
              level = pc.bold(pc.bgRed('[ERROR]'));
              break;
            }

            case LogLevel.WARN: {
              level = pc.bold(pc.bgYellow('[WARN]'));
              break;
            }

            default: {
              level = pc.bold(pc.whiteBright('[WARN]'));
              break;
            }
          }

          console.log(
            `${level} [${logLine.date?.seconds}] ${
              logLine.tags.map((x) => `[${x}]`).join(" ")
            } ${logLine.message}`,
          );
        })
        .on("error", reject)
        .on("close", resolve);
    });
  }
}
