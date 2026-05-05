import packageInfo from '../package.json' with { type: 'json' }
import { buildApplication, buildRouteMap } from '@stricli/core'
import serve from './commands/serve/command.js'
import bundle from './commands/bundle/command.js'
import logcat from './commands/logcat/command.js'
import test from './commands/test/command.js'

const { name, version, description } = packageInfo

const routes = buildRouteMap({
  routes: {
    bundle,
    logcat,
    serve,
    test,
  },
  docs: {
    brief: description,
  },
})

export const app = buildApplication(routes, {
  name,
  versionInfo: {
    currentVersion: version,
  },
})
