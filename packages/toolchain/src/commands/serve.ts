import {Flags, CliUx} from '@oclif/core'
import {CLICommand} from '../command'
import Bundle from './bundle'
import Server from '../server'
import Utils from '../utils'
import chalk from 'chalk'
import {watch} from 'node:fs'
import * as path from 'node:path'

const cli = CliUx.ux

export default class Serve extends CLICommand {
  static override description = 'Build the sources and start a local server'

  static override flags = {
    help: Flags.help({char: 'h'}),
    port: Flags.integer({char: 'p', default: 8080}),
    watch: Flags.boolean({char: 'w', description: 'Rebuild sources on typescript file changes within directory', default: false}),
    'use-node-fs': Flags.boolean({description: 'For more info, check https://github.com/Paperback-iOS/paperback-toolchain/pull/4#issuecomment-1791566399', required: false, default: false}),
  }

  workingPath = process.cwd()

  async _bundleRun(useNodeFS: boolean) {
    await Bundle.run([
      ...(useNodeFS ? ['--use-node-fs'] : []),
    ])
  }

  async _rebuildSources(useNodeFS: boolean) {
    this.log(chalk.underline.blue('Building Sources'))
    await this._bundleRun(useNodeFS)
    this.log(chalk.underline.blue('Sources Rebuilt'))
  }

  async run() {
    const {flags} = await this.parse(Serve)

    console.clear()

    this.log(chalk.underline.blue('Building Sources'))

    // Make sure the repo is bundled
    await this._bundleRun(flags['use-node-fs'])
    this.log()
    this.log(chalk.underline.blue('Starting Server on port ' + flags.port))

    const server = new Server(flags.port)

    server.start()
    this.log()
    this.log(chalk`For a list of commands do {green h} or {green help}`)

    let isRebuildingSources = false
    let watcher: any
    if (flags.watch) {
      watcher = watch(path.join(this.workingPath, 'src'), {recursive: true}, async (_eventType, filename) => {
        if (isRebuildingSources === false && filename?.endsWith('.ts')) {
          isRebuildingSources = true
          await this._rebuildSources(flags['use-node-fs'])
          isRebuildingSources = false
        }
      })
    }

    let stopServer = false
    while (!stopServer) {
      // eslint-disable-next-line no-await-in-loop
      const input = (await cli.prompt(Utils.prefixTime(''), {required: false}) as string)?.trim() ?? ''

      if (input === 'h' || input === 'help') {
        this.log(chalk.underline.bold('Help'))
        this.log('  h, help - Display this message')
        this.log('  s, stop - Stop the server')
        this.log('  r, rebuild - Rebuilds the sources')
        this.log('  rs, restart - Restart the server, also rebuilding the sources')
      }

      if (input === 's' || input === 'stop') {
        watcher?.close()

        stopServer = true
      }

      if (input === 'rs' || input === 'restart') {
        server.stop()

        console.clear()

        this.log(chalk.underline.blue('Building Sources'))

        // Make sure the repo is bundled
        // eslint-disable-next-line no-await-in-loop
        await this._bundleRun(flags['use-node-fs'])
        this.log()
        this.log(chalk.underline.blue('Starting Server on port ' + flags.port))

        server.start()
        this.log()
        this.log(chalk`For a list of commands do {green h} or {green help}`)
      }

      if (input === 'r' || input === 'rebuild') {
        console.clear()

        // eslint-disable-next-line no-await-in-loop
        await this._bundleRun(flags['use-node-fs'])
        this.log()

        this.log(chalk`For a list of commands do {green h} or {green help}`)
      }
    }

    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    process.exit(0)
  }
}
