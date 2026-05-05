#!/usr/bin/env node
import { run } from '@stricli/core'
import { buildContext } from '../context.js'
import { app } from '../app.js'
await run(app, process.argv.slice(2), buildContext(process))
