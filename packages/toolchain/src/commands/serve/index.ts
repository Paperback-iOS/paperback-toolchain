import pc from 'picocolors'
import path from 'node:path';
import readline from 'node:readline/promises'
import { bundle, type BundleFlags } from '../bundle/index.js';
import { clearConsole, prefixTime, startFileWatcher } from '../../toolchain/serve.js'
import { startServer } from '../../toolchain/http-server.js';
import type { LocalContext } from "../../context.js";
import type { FSWatcher } from 'node:fs';

export interface ServeFlags {
  watch: boolean
  port: number
}

const bundleFlags: BundleFlags = {
  debug: false, tests: false
}

let rebuildDebounce: NodeJS.Timeout | undefined
let isRebuilding = false

export async function serve(this: LocalContext, flags: ServeFlags) {
  clearConsole()
  console.log(pc.underline(pc.blue('Building Sources')))

  // Make sure the repo is bundled
  await bundle.bind(this)(bundleFlags)
  console.log('\n', pc.underline(pc.blue('Starting Server on port ' + flags.port)))

  let server = startServer(flags.port)
  console.log(`\nFor a list of commands do ${pc.green('h')} or ${pc.green('help')}`)

  // Create readline interface with promises API
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  let rlSignal: AbortController | undefined
  let watcher: FSWatcher | undefined
  // Start file watcher if watch mode is enabled
  if (flags.watch) {
    const srcDir = path.join(process.cwd(), 'src')
    console.log(pc.yellow(`Watching for changes in ${srcDir}`))
    watcher = startFileWatcher(srcDir, filename => {
      if (isRebuilding) return

      console.log(`file: ${filename} changed, scheduling rebuild`)
      rlSignal?.abort()

      if (rebuildDebounce != undefined) clearTimeout(rebuildDebounce)

      rebuildDebounce = setTimeout(async () => {
        isRebuilding = true
        
        server.close()

        clearConsole()
        console.log(pc.underline(pc.blue('Building Sources')))

        await bundle.bind(this)(bundleFlags)

        server = startServer(flags.port)
        console.log(`\nFor a list of commands do ${pc.green('h')} or ${pc.green('help')}`)
        rlSignal?.abort()

        isRebuilding = false
      }, 500);
    })
  }

  // Handle Ctrl-C gracefully
  rl.on('SIGINT', () => {
    if (watcher != undefined) {
      console.log('\nStopping watcher...')
      watcher.close()
    }

    console.log('\nStopping server...')
    server.close()
    rl.close()

    process.exit(0)
  })

  let stopServer = false
  while (!stopServer) {
    rlSignal = new AbortController()

    let input: string
    try { input = await rl.question(prefixTime(''), { signal: rlSignal.signal }) } catch {
      continue
    }

    if (input === 'h' || input === 'help') {
      console.log(pc.underline(pc.bold('Help')))
      console.log('  h, help - Display this message')
      console.log('  s, stop - Stop the server')
      console.log('  r, restart - Restart the server, also rebuilds the sources')
    }

    if (input === 's' || input === 'stop') {
      stopServer = true
    }

    if (input === 'r' || input === 'restart') {
      server.close()

      clearConsole()
      console.log(pc.underline(pc.blue('Building Sources')))

      await bundle.bind(this)(bundleFlags)

      server = startServer(flags.port)
      console.log(`\nFor a list of commands do ${pc.green('h')} or ${pc.green('help')}`)
    }
  }

  if (watcher != undefined) {
    console.log('\nStopping watcher...')
    watcher.close()
  }

  console.log('Stopping server...')
  server.close()

  // Close the readline interface before exiting
  rl.close()

  process.exit(0)
}