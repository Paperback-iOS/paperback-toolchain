import { buildCommand, numberParser } from '@stricli/core'
import { test } from './index.js'

export default buildCommand({
  func: test,
  parameters: {
    flags: {
      generate: { kind: 'boolean', brief: 'generate default tests' },
      overwrite: {
        kind: 'boolean',
        brief: 'overwrite existing tests',
        default: false,
      },
      output: {
        kind: 'parsed',
        brief: 'output file',
        parse: String,
        optional: true,
      },
      console: {
        kind: 'boolean',
        brief: 'display captured console',
        default: true,
      },
      ignoreErrors: {
        kind: 'boolean',
        brief: 'ignore test failures and exit with code 0',
        default: false,
      },
      flaresolverr: {
        kind: 'parsed',
        brief:
          'full URI of the flaresolverr endpoint (e.g. http://localhost:8191/v1) to use to try and bypass Cloudflare challenges',
        parse: String,
        optional: true,
      },
    },
    positional: {
      kind: 'tuple',
      parameters: [
        {
          brief: 'sourceId of the source that should be tested',
          optional: true,
          parse: String,
        },
      ],
    },
  },
  docs: {
    brief: 'run the paperback test suite',
  },
})
