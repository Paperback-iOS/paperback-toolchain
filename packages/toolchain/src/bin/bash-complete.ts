#!/usr/bin/env node

/**
 * Notes by Paper
 * This is not used because it causes `npm i` to stop working without `--ignore-scripts`
 *
 * To add this back in, add it as an entry point in tsdown inside package.json and add postinstall script
 * in package.json that runs "paperback-cli install". Also, add the following routes to app.ts
 * install: buildInstallCommand("paperback-toolchain-stricli", { bash: "__paperback-toolchain-stricli_bash_complete" }),
 * uninstall: buildUninstallCommand("paperback-toolchain-stricli", { bash: true }),
 * and hide them with the following config in `docs` in app.ts
 * hideRoute: {
 *   install: true,
 *   uninstall: true,
 * },
 */

import { proposeCompletions } from '@stricli/core'
import { buildContext } from '../context.js'
import { app } from '../app.js'
const inputs = process.argv.slice(3)
if (process.env['COMP_LINE']?.endsWith(' ')) {
  inputs.push('')
}
await proposeCompletions(app, inputs, buildContext(process))
try {
  for (const { completion } of await proposeCompletions(
    app,
    inputs,
    buildContext(process)
  )) {
    process.stdout.write(`${completion}\n`)
  }
} catch {
  // ignore
}
