import { Command, Flags } from "@oclif/core";
import * as readline from "readline/promises";
import * as fs from "fs";
import * as path from "path";

import Server from "../server.js";
import Bundle from "./bundle.js";

import pc from "picocolors";

export default class Serve extends Command {
  static override description = "Build the sources and start a local server";

  static override flags = {
    help: Flags.help({ char: "h" }),
    port: Flags.integer({ char: "p", default: 8080 }),
    watch: Flags.boolean({
      char: "w",
      description: "Watch for file changes and rebuild automatically",
    }),
  };

  // Debounce timeout to avoid multiple rebuilds
  private debounceTimeout: NodeJS.Timeout | null = null;
  private debounceDelay = 500; // ms
  private isRebuilding = false;

  fixedWidth(number: number, width: number) {
    return (Array.from({ length: width }).join("0") + number).slice(-width);
  }

  async run() {
    const { flags } = await this.parse(Serve);

    this.clearConsole();

    this.log(pc.blue("Building Sources"));

    // Make sure the repo is bundled
    await Bundle.run(['--debug']);
    this.log();
    this.log(pc.underline(pc.blue("Starting Server on port " + flags.port)));

    const server = new Server(flags.port);

    server.start();
    this.log();
    this.log(
      `For a list of commands do ${pc.green("h")} or ${pc.green("help")}`
    );

    // Start file watcher if watch mode is enabled
    if (flags.watch) {
      const srcDir = path.join(process.cwd(), "src");
      this.log(pc.yellow(`Watching for changes in ${srcDir}`));
      this.startFileWatcher(srcDir);
    }

    // Create readline interface with promises API
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Handle Ctrl-C gracefully
    rl.on("SIGINT", () => {
      this.log("\nStopping server...");
      server.stop();
      rl.close();
      process.exit(0);
    });

    let stopServer = false;
    while (!stopServer) {
      const input = await rl.question(this.prefixTime(""));

      if (input === "h" || input === "help") {
        this.log(pc.underline(pc.bold("Help")));
        this.log("  h, help - Display this message");
        this.log("  s, stop - Stop the server");
        this.log(
          "  r, restart - Restart the server, also rebuilds the sources"
        );
      }

      if (input === "s" || input === "stop") {
        this.log("Stopping server...");
        stopServer = true;
      }

      if (input === "r" || input === "restart") {
        server.stop();

        await this.rebuildSources(flags.port);

        server.start();
        this.log();
        this.log(
          `For a list of commands do ${pc.green("h")} or ${pc.green("help")}`
        );
      }
    }

    // Close the readline interface before exiting
    rl.close();
    server.stop();

    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    process.exit(0);
  }

  private async rebuildSources(port: number): Promise<void> {
    this.clearConsole();
    this.log(pc.underline(pc.blue("Building Sources")));
    await Bundle.run(['--debug']);
    this.log();
    this.log(pc.underline(pc.blue(`Starting Server on port ${port}`)));
  }

  private startFileWatcher(directory: string): void {
    try {
      // Watch the entire src directory recursively
      fs.watch(directory, { recursive: true }, (eventType, filename) => {
        if (!filename) return;

        // Skip non-source files
        if (
          !filename.endsWith(".ts") &&
          !filename.endsWith(".js") &&
          !filename.endsWith(".json") &&
          !filename.endsWith(".css") &&
          !filename.endsWith(".html") &&
          !filename.endsWith(".png") &&
          !filename.endsWith(".jpg") &&
          !filename.endsWith(".svg")
        ) {
          return;
        }

        this.debouncedRebuild(filename);
      });
    } catch (error) {
      this.log(pc.red(`Failed to watch directory ${directory}: ${error}`));
    }
  }

  private debouncedRebuild(filename: string): void {
    if (this.isRebuilding) return;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(async () => {
      try {
        if (this.isRebuilding) return;

        this.isRebuilding = true;
        this.clearConsole();
        this.log(pc.yellow(`File changed: ${filename}. Rebuilding...`));

        await Bundle.run(['--debug']);

        this.log(pc.green("Rebuild completed. Server up-to-date."));
      } catch (error) {
        this.log(pc.red(`Error during rebuild: ${error}`));
      } finally {
        this.isRebuilding = false;
      }
    }, this.debounceDelay);
  }

  private prefixTime(message = "") {
    const date = new Date();

    const hours = this.fixedWidth(date.getHours(), 2);
    const minutes = this.fixedWidth(date.getMinutes(), 2);
    const seconds = this.fixedWidth(date.getSeconds(), 2);
    const milliseconds = this.fixedWidth(date.getMilliseconds(), 4);
    const time = `${hours}:${minutes}:${seconds}:${milliseconds}`;
    return `[${pc.gray(time)}] ${message}`;
  }

  private clearConsole() {
    // Clear the console
    process.stdout.write('\x1bc\x1b[3J');
  }
}
